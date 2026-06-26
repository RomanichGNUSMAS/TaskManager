const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: String,
        enum : ["Backend","UX Research",
            "General","Development",
            "Mobile App","Website Redesign",
            "Product Relaunch","Marketing"],
        required: true,
        link : {
            type :String,
            required:false
        }
    },
    location: {
        type: String,
        required: true,
        default: 'Online' 
    },
    date: {
        type: Date,
        required: true
    },
    eventType: {
        type: String,
        enum: ['meeting', 'deadline', 'task', 'reminder'],
        default: 'meeting'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    teamLeadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);