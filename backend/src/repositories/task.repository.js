const { userModel } = require('../models/user.model');
const { taskModel } = require('../models/task.model');
const { ProjectRepository } = require('./project.repository');
const { verifyToken } = require('../utils/jwt');
const { default: mongoose } = require('mongoose');
const { projectModel } = require('../models/project.model');

exports.TaskRepository = class {
  static _toObjectId(id) {
    const ObjectId = mongoose.Types.ObjectId;
    return id instanceof ObjectId ? id : new ObjectId(id);
  }

  static async _sendTaskNotifications({ userIds = [], teamLeadId, message }) {
    const recipientIds = [];

    if (Array.isArray(userIds)) {
      recipientIds.push(...userIds.map(id => TaskRepository._toObjectId(id)));
    }
    if (teamLeadId) {
      recipientIds.push(TaskRepository._toObjectId(teamLeadId));
    }

    const uniqueIds = [...new Set(recipientIds.map(id => id.toString()))].map(id => TaskRepository._toObjectId(id));
    if (!uniqueIds.length) return;

    await userModel.updateMany(
      { _id: { $in: uniqueIds } },
      { $push: { notifications: message } },
    );
  }

  static async _buildTaskNotification(task, action) {
    return {
      _id: new mongoose.Types.ObjectId(),
      text: `Task "${task.title}" ${action}`,
      isRead: false,
      createdAt: new Date(),
    };
  }

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

    const userIds = Array.isArray(rawData.userIds) ? rawData.userIds.map(id => TaskRepository._toObjectId(id)) : [];
    const projectId = TaskRepository._toObjectId(rawData.projectId);
    const task = new taskModel({
      ...rawData,
      userIds,
      projectId,
    });

    const savedTask = await task.save();
    const project = await projectModel.findById(projectId);

    await TaskRepository._sendTaskNotifications({
      userIds: savedTask.userIds,
      teamLeadId: project?.teamLeadId,
      message: await TaskRepository._buildTaskNotification(savedTask, 'was created'),
    });

    await projectModel.findByIdAndUpdate(projectId, {
      $inc: { tasksCount: 1 },
    });

    return savedTask;
  }

  static async setStateToTask(taskId, state) {
    const task = await taskModel.findOneAndUpdate(
      { _id: TaskRepository._toObjectId(taskId) },
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

    const task = await taskModel.findById(TaskRepository._toObjectId(taskId));
    if (!task) return null;

    const updatedData = { ...rawData };
    if (Array.isArray(rawData.userIds)) {
      updatedData.userIds = rawData.userIds.map(id => TaskRepository._toObjectId(id));
    }

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: task._id },
      updatedData,
      { new: true },
    );

    const project = await projectModel.findById(updatedTask.projectId);
    await TaskRepository._sendTaskNotifications({
      userIds: updatedTask.userIds,
      teamLeadId: project?.teamLeadId,
      message: await TaskRepository._buildTaskNotification(updatedTask, 'was updated'),
    });

    return updatedTask;
  }

  static async deleteTask(token, taskId) {
    const jwt = verifyToken(token);
    if (!jwt) return 403;

    const task = await taskModel.findById(TaskRepository._toObjectId(taskId));
    if (!task) return null;

    const project = await projectModel.findById(task.projectId);
    const result = await taskModel.deleteOne({ _id: task._id });

    if (task.status === 'done') {
      await projectModel.findByIdAndUpdate(task.projectId, {
        $inc: { completedCount: -1, tasksCount: -1 },
      });
    } else {
      await projectModel.findByIdAndUpdate(task.projectId, {
        $inc: { tasksCount: -1 },
      });
    }

    await TaskRepository._sendTaskNotifications({
      userIds: task.userIds,
      teamLeadId: project?.teamLeadId,
      message: await TaskRepository._buildTaskNotification(task, 'was deleted'),
    });

    return result;
  }
};
