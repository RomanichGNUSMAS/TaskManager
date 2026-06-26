const { userModel } = require('../models/user.model');
const { taskModel } = require('../models/task.model');
const { ProjectRepository } = require('./project.repository');
const { verifyToken } = require('../utils/jwt');
const { default: mongoose } = require('mongoose');

exports.TaskRepository = class {
  static async getAllTasksOfProject(projectId) {
    const tasks = await taskModel.find({ projectId });
    return tasks;
  }

  static async getOneTask(taskId) {
    return await taskModel.findOne({ _id: taskId });
  }
  static async newTask(token, rawData) {
    const jwt = verifyToken(token);
    const ObjectId = mongoose.Types.ObjectId;
    if (!jwt) return 403;
    const task = new taskModel({...rawData,userId:new ObjectId(rawData.userId), projectId:new ObjectId(rawData.projectId)});
    return await task.save();
  }

  static async setStateToTask(taskId, state) {
    const task = await taskModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(taskId) },
      { $set: { status: state } },
      { new: true },
    );
    if (state == 'done')
      await ProjectRepository.updateProject(
        token,
        {
          $inc: { completedCount: 1 },
        },
        task.projectId,
      );
    return task;
  }

  static async updateTask(token, taskId, rawData) {
    const jwt = verifyToken(token);
    if (!jwt) return 403;
    return await taskModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(taskId) }, rawData, {
      new: true,
    });
  }

  static async deleteTask(token, taskId) {
    const jwt = verifyToken(token);
    if (!jwt) return 403;
    return await taskModel.deleteOne({ _id:new mongoose.Types.ObjectId(taskId) })
  }
};
