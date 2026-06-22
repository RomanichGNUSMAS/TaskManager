const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['TEAMLEAD', 'DEVELOPER'], default: 'DEVELOPER' },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    settings: {
        appearance: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
        language: { type: String, enum: ['en', 'ru', 'am'], default: 'ru' },
        timezone: { type: String, default: 'Asia/Yerevan' }
    },

    notifications: [{
        text: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

exports.userModel = mongoose.model('User', userSchema);