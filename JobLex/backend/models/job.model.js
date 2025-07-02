const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    experienceLevel:{
        type:Number,
        required:true,
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ],
    applicationType: {
        type: String,
        enum: ['internal', 'external'],
        default: 'internal'
    },
    careerPageUrl: {
        type: String,
        required: function() {
            return this.applicationType === 'external';
        }
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    expiryDate: {
        type: Date,
        required: false
    }
},{timestamps:true});

const Job = mongoose.model("Job", jobSchema);
module.exports = { Job };