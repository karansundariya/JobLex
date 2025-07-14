const { Job } = require("../models/job.model.js");
const { User } = require("../models/user.model.js");
const sendEmail = require("../utils/email.js");
const { Company } = require("../models/company.model.js");

// Job controller logic updated

// admin post krega job
const postJob = async (req, res) => {
    try {
        console.log("postJob controller called");
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, applicationType, careerPageUrl, expiryDate, status } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !location || !jobType || !experience || !companyId || !applicationType) {
            console.log("Missing required fields");
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        };

        // Validate careerPageUrl for external applications
        if (applicationType === 'external' && !careerPageUrl) {
            console.log("Missing careerPageUrl for external application");
            return res.status(400).json({
                message: "Career page URL is required for external applications.",
                success: false
            });
        }

        // Set expiryDate (default to 30 days from now if not provided)
        let expiry = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        // Set status
        let jobStatus = status || 'open';
        if (expiry < new Date()) {
            jobStatus = 'closed';
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: salary ? Number(salary) : "Not Disclosed",
            location,
            jobType,
            experienceLevel: experience,
            position: position ? Number(position) : "Not Disclosed",
            company: companyId,
            created_by: userId,
            applicationType,
            careerPageUrl: applicationType === 'external' ? careerPageUrl : undefined,
            expiryDate: expiry,
            status: jobStatus
        });
        console.log("Job created:", job.title);

        // Fetch company details for email
        const company = await Company.findById(companyId);
        const companyName = company ? company.name : "Unknown Company";
        const companyLocation = company && company.location ? company.location : location;

        // Notify users tracking keywords
        const usersToNotify = await User.find({ trackedKeywords: { $exists: true, $ne: [] } });
        console.log("Users to notify:", usersToNotify.length);
        for (const user of usersToNotify) {
            console.log("Checking user:", user.email, user.trackedKeywords);
            const jobWords = (job.title + ' ' + job.description).toLowerCase().split(/\W+/);
            console.log("Job words:", jobWords);
            const matchedKeywords = user.trackedKeywords.filter(keyword => {
                const kw = keyword.toLowerCase();
                console.log("Checking keyword:", kw, "in jobWords:", jobWords);
                return jobWords.includes(kw);
            });
            console.log("Matched keywords for user", user.email, ":", matchedKeywords);
            if (matchedKeywords.length > 0) {
                console.log(`Sending job alert to ${user.email} for keywords: ${matchedKeywords.join(', ')}`);
                try {
                    await sendEmail(
                        user.email,
                        `New Job Alert: ${job.title}`,
                        `A new job matching your interest ('${matchedKeywords.join(", ")}') has been posted: ${job.title}\n\nCompany: ${companyName}\nLocation: ${companyLocation}\nDescription: ${job.description}\n\nVisit the portal to apply!`
                    );
                    console.log("Email sent to:", user.email);
                } catch (e) {
                    console.error(`Failed to send job alert to ${user.email}:`, e);
                }
            }
        }

        return res.status(201).json({
            message: "New job created successfully.",
            job,
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

// student k liye
const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const now = new Date();
        const query = {
            $and: [
                {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                    ]
                },
                { status: 'open' },
                { $or: [ { expiryDate: { $exists: false } }, { expiryDate: { $gt: now } } ] }
            ]
        };
        const jobs = await Job.find(query).populate([
            {
                path: "company"
            },
            {
                path: "applications",
                populate: {
                    path: "applicant"
                }
            }
        ]).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// student
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({ path: "company" })
            .populate({ path: "applications" });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// admin kitne job create kra hai abhi tk
const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found', success: false });
        }
        // Only allow if the user is the creator or an admin
        if (job.created_by.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job', success: false });
        }
        await Job.findByIdAndDelete(jobId);
        return res.status(200).json({ message: 'Job deleted successfully', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Update a job by ID
const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId,
            applicationType,
            careerPageUrl,
            expiryDate,
            status
        } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found', success: false });
        }
        if (job.created_by.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job', success: false });
        }

        // Update fields if provided, handle optional/empty fields safely
        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;
        if (requirements !== undefined) {
            job.requirements = requirements ? requirements.split(',') : [];
        }
        if (salary !== undefined) {
            job.salary = salary === "" ? "Not Disclosed" : Number(salary);
        }
        if (location !== undefined) job.location = location;
        if (jobType !== undefined) job.jobType = jobType;
        if (experience !== undefined) {
            job.experienceLevel = experience === "" ? 0 : Number(experience);
        }
        if (position !== undefined) {
            job.position = position === "" ? "Not Disclosed" : Number(position);
        }
        if (companyId !== undefined) job.company = companyId;
        if (applicationType !== undefined) job.applicationType = applicationType;
        if (careerPageUrl !== undefined) job.careerPageUrl = careerPageUrl;
        if (expiryDate !== undefined) job.expiryDate = expiryDate ? new Date(expiryDate) : undefined;
        if (status !== undefined) job.status = status;

        await job.save();
        return res.status(200).json({ message: 'Job updated successfully', job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to update job', success: false });
    }
};

module.exports = { postJob, getAllJobs, getJobById, getAdminJobs, deleteJob, updateJob };
