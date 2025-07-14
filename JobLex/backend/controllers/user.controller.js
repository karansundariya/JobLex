const { User } = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri.js");
const cloudinary = require("../utils/cloudinary.js");
const { Application } = require("../models/application.model.js");

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};

// Register new user logic updated for clarity
const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded", success: false });
        }
        let cloudResponse;
        try {
            cloudResponse = await uploadToCloudinary(file.buffer);
        } catch (cloudErr) {
            console.error('Cloudinary upload error:', cloudErr);
            return res.status(500).json({
                message: "Cloudinary upload failed. Check credentials and file type.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            trackedKeywords: user.trackedKeywords || []
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'None' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, secure: true, sameSite: 'None' }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.files?.file?.[0];
        const profilePhoto = req.files?.profilePhoto?.[0];
        let resumeCloudResponse = null;
        let photoCloudResponse = null;
        if (file) {
            try {
                resumeCloudResponse = await uploadToCloudinary(file.buffer);
            } catch (cloudErr) {
                console.error('Cloudinary upload error:', cloudErr);
                return res.status(500).json({
                    message: "Cloudinary upload failed. Check credentials and file type.",
                    success: false
                });
            }
        }
        if (profilePhoto) {
            try {
                photoCloudResponse = await uploadToCloudinary(profilePhoto.buffer);
            } catch (cloudErr) {
                console.error('Cloudinary upload error:', cloudErr);
                return res.status(500).json({
                    message: "Cloudinary upload failed. Check credentials and file type.",
                    success: false
                });
            }
        }

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // Save resume if uploaded
        if(resumeCloudResponse && file){
            user.profile.resume = resumeCloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }
        // Save profile photo if uploaded
        if(photoCloudResponse && profilePhoto){
            user.profile.profilePhoto = photoCloudResponse.secure_url;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            trackedKeywords: user.trackedKeywords || []
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const markJobAsApplied = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if already applied
        if (user.appliedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Job already marked as applied",
                success: false
            });
        }

        // Add job to applied jobs
        user.appliedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            message: "Job marked as applied successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const checkJobApplied = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check for external (marked) applications
        let isApplied = user.appliedJobs.includes(jobId);

        // Efficiently check for internal applications only if not already applied
        if (!isApplied) {
            isApplied = await Application.exists({ job: jobId, applicant: userId });
        }

        return res.status(200).json({
            isApplied: !!isApplied,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Save a job for later
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({ message: 'Job already saved', success: false });
        }
        user.savedJobs.push(jobId);
        await user.save();
        return res.status(200).json({ message: 'Job saved for later', success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Get all saved jobs for the user
const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('savedJobs');
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        return res.status(200).json({ jobs: user.savedJobs, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Unsave a job for later
const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        user.savedJobs = user.savedJobs.filter(jid => jid.toString() !== jobId);
        await user.save();
        return res.status(200).json({ message: 'Job removed from saved', success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Add a tracked keyword
const addTrackedKeyword = async (req, res) => {
    try {
        const userId = req.id;
        const { keyword } = req.body;
        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required', success: false });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        if (user.trackedKeywords.includes(keyword)) {
            return res.status(400).json({ message: 'Keyword already tracked', success: false });
        }
        user.trackedKeywords.push(keyword);
        await user.save();
        return res.status(200).json({ message: 'Keyword added', trackedKeywords: user.trackedKeywords, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Remove a tracked keyword
const removeTrackedKeyword = async (req, res) => {
    try {
        const userId = req.id;
        const { keyword } = req.body;
        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required', success: false });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        user.trackedKeywords = user.trackedKeywords.filter(k => k !== keyword);
        await user.save();
        return res.status(200).json({ message: 'Keyword removed', trackedKeywords: user.trackedKeywords, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Add getProfile controller
const getProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        return res.status(200).json({
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
                trackedKeywords: user.trackedKeywords || []
            },
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Get total and active users
const getUserStats = async (req, res) => {
    console.log('getUserStats called');
    try {
        const totalUsers = await User.countDocuments();
        console.log('User count:', totalUsers);
        // Log collection name for debug
        console.log('Collection name:', User.collection.collectionName);
        res.json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user stats', error });
    }
};

module.exports = { register, login, logout, updateProfile, markJobAsApplied, checkJobApplied, saveJob, getSavedJobs, unsaveJob, addTrackedKeyword, removeTrackedKeyword, getProfile, getUserStats };