const { Company } = require("../models/company.model.js");
const getDataUri = require("../utils/datauri.js");
const cloudinary = require("../utils/cloudinary.js");

const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            });
        };
        // Handle logo upload
        let logoUrl = undefined;
        if (req.files && req.files.logo && req.files.logo[0]) {
            const file = req.files.logo[0];
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudResponse.secure_url;
        }
        company = await Company.create({
            name: companyName,
            userId: req.id,
            logo: logoUrl
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        let updateData = {};
        if (name !== undefined && name !== "") updateData.name = name;
        if (description !== undefined && description !== "") updateData.description = description;
        if (website !== undefined && website !== "") updateData.website = website;
        if (location !== undefined && location !== "") updateData.location = location;
        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }
        // Only allow if the user is the owner
        if (company.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this company', success: false });
        }
        await Company.findByIdAndDelete(companyId);
        return res.status(200).json({ message: 'Company deleted successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany, deleteCompany };