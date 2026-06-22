const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
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

// Красивый экспорт модели
module.exports = mongoose.model('Event', eventSchema);