const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, enum: ['active', 'on_hold', 'completed'], default: 'active' },
  tasksCount: { type: Number, default: 0 },
  completedCount: { type: Number, default: 0 },
  favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

exports.projectModel = mongoose.model('Project', projectSchema);