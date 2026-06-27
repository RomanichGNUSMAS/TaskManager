const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'low' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['todo', 'in_process','review', 'done'], default: 'todo' },
  subtasks: [{
    title: { type: String, required: true },
    done: { type: Boolean, default: false }
  }]
}, { timestamps: true });

exports.taskModel = mongoose.model('Task', taskSchema);