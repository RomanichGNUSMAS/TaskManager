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
      recipientIds.push(...userIds.map(id => this._toObjectId(id)));
    }
    if (teamLeadId) {
      recipientIds.push(this._toObjectId(teamLeadId));
    }

    const uniqueIds = [...new Set(recipientIds.map(id => id.toString()))].map(id => this._toObjectId(id));
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
    if (!jwt) return 403;

    const ObjectId = mongoose.Types.ObjectId;
    const userIds = Array.isArray(rawData.userIds) ? rawData.userIds.map(id => this._toObjectId(id)) : [];
    const projectId = this._toObjectId(rawData.projectId);
    
    const safeSubtasks = Array.isArray(rawData.subtasks) 
      ? rawData.subtasks.map(subtask => ({ ...subtask, _id: new mongoose.Types.ObjectId() }))
      : [];

    const task = new taskModel({
      ...rawData,
      userIds,
      projectId,
      subtasks: safeSubtasks
    });

    const savedTask = await task.save();
    const project = await projectModel.findById(projectId);

    await this._sendTaskNotifications({
      userIds: savedTask.userIds,
      teamLeadId: project?.teamLeadId,
      message: await this._buildTaskNotification(savedTask, 'was created'),
    });

    await projectModel.findByIdAndUpdate(projectId, {
      $inc: { tasksCount: 1 },
    });

    return savedTask;
  }

  static async setStateToTask(taskId, state) {
    const found = await taskModel.findOne({ _id: this._toObjectId(taskId) });
    if (!found) return null;

    if (found.status && found.status.toLowerCase() === 'done') return found;

    const task = await taskModel.findOneAndUpdate(
      { _id: this._toObjectId(taskId) },
      { $set: { status: state } },
      { new: true },
    );

    if (state && state.toLowerCase() === 'done') {
      await projectModel.findByIdAndUpdate(
        task.projectId, 
        { $inc: { completedCount: 1 } }
      );
    }
    return task;
  }

  static async updateTask(token, taskId, payload) {
    const jwt = verifyToken(token);
    if (!jwt) return 403;

    const { title, status, priority, addedSubtasks, removedSubtasks } = payload;
    const ObjectId = mongoose.Types.ObjectId;
    const updateFields = {};

    if (status) updateFields.status = status;
    if (title) updateFields.title = title;
    if (priority) updateFields.priority = priority;

    const mongoUpdate = {};
    if (Object.keys(updateFields).length > 0) {
      mongoUpdate.$set = updateFields;
    }

    if (addedSubtasks && addedSubtasks.length > 0) {
      mongoUpdate.$push = {
        subtasks: { $each: addedSubtasks.map(sub => ({ ...sub, _id: new ObjectId() })) }
      };
    }

    const currentTask = await taskModel.findById(this._toObjectId(taskId));
    if (!currentTask) return 404;

    const oldStatus = currentTask.status ? currentTask.status.toLowerCase() : '';
    const newStatus = status ? status.toLowerCase() : '';

    if (status) {
      if (oldStatus === 'done' && newStatus !== 'done') {
        await projectModel.findByIdAndUpdate(
          this._toObjectId(currentTask.projectId),
          { $inc: { completedCount: -1 } }
        );
      } else if (oldStatus !== 'done' && newStatus === 'done') {
        await projectModel.findByIdAndUpdate(
          this._toObjectId(currentTask.projectId),
          { $inc: { completedCount: 1 } }
        );
      }
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      this._toObjectId(taskId),
      mongoUpdate,
      { new: true }
    );

    if (removedSubtasks && removedSubtasks.length > 0 && updatedTask) {
      return await taskModel.findByIdAndUpdate(
        this._toObjectId(taskId),
        { $pull: { subtasks: { _id: { $in: removedSubtasks.map(id => new ObjectId(id)) } } } },
        { new: true }
      );
    }

    return updatedTask;
  }

  static async deleteSubtask(taskId, subtaskId) {
    const result = await taskModel.updateOne(
      { _id: this._toObjectId(taskId) },
      { $pull: { subtasks: { _id: this._toObjectId(subtaskId) } } }
    );
    return;
  }

  static async deleteTask(token, taskId) {
    const jwt = verifyToken(token);
    if (!jwt) return 403;

    const task = await taskModel.findById(this._toObjectId(taskId));
    if (!task) return null;

    const project = await projectModel.findById(task.projectId);
    const result = await taskModel.deleteOne({ _id: task._id });

    if (task.status && task.status.toLowerCase() === 'done') {
      await projectModel.findByIdAndUpdate(task.projectId, {
        $inc: { completedCount: -1, tasksCount: -1 },
      });
    } else {
      await projectModel.findByIdAndUpdate(task.projectId, {
        $inc: { tasksCount: -1 },
      });
    }

    await this._sendTaskNotifications({
      userIds: task.userIds,
      teamLeadId: project?.teamLeadId,
      message: await this._buildTaskNotification(task, 'was deleted'),
    });

    return result;
  }
};