const { TaskRepository } = require("../repositories/task.repository")
const { AppError } = require("../errors/AppError");
const { taskScheme } = require("../validators/task.validator");
const { statuses } = require("../constants/statuses");
const { projectModel } = require("../models/project.model");

exports.TaskService = class {
    static async getAllOfProject(projectId) {
        return await TaskRepository.getAllTasksOfProject(projectId);
    }

    static async getOneTask(taskId) {
        const result = await TaskRepository.getOneTask(taskId);
        if (!result) throw new AppError('task not found', 404);
        return result;
    }

    static async newTask(token, rawData) {
        const project = await projectModel.findById(rawData.projectId);
        if(!project) throw new AppError('project not found', 404);
        const validation = await taskScheme.safeParse(rawData);
        if (!validation) throw new AppError('invalid credentials', 400);
        const result = await TaskRepository.newTask(token, rawData);
        switch (result) {
            case 403: {
                throw new AppError('you dont have permission to create new task', 403)
            }
            default: {
                return result;
            }
        }
    }

    static async setStateToTask(taskId, state) {
        if (!statuses.includes(state)) throw new AppError('invalid state', 400)
        const result = await TaskRepository.setStateToTask(taskId, state);
        if (!result) throw new AppError('task not found', 404)
        return result;
    }

    static async updateTask(token, taskId, rawData) {
        const result = await TaskRepository.updateTask(token, taskId, rawData);
        if (!result) throw new AppError('task not found', 404)
        switch (result) {
            case 403: {
                throw new AppError('you dont have a permission to update Task', 403)
            }
            default: {
                return result;
            }
        }
    }

    static async deleteSubtask(taskId,subtaskId) {
        return TaskRepository.deleteSubtask(taskId,subtaskId)
    }

    static async deleteTask(token, taskId) {
        const result = await TaskRepository.deleteTask(token, taskId);
        if (!result) throw new AppError('task not found', 404)
        switch (result) {
            case 403: {
                throw new AppError('you dont have a permission to delete task')
            }
            default: {
                return result;
            }
        }
    }
}