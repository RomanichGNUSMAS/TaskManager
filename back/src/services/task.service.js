const { TaskRepository } = require("../repositories/task.repository")
const { AppError } = require("../errors/AppError")

exports.TaskService = class {
    static async getAllOfProject(projectId) {
        return await TaskRepository.getAllTasksOfProject(projectId);
    }

    static async getOneTask(taskId) {
        return await TaskRepository.getOneTask(taskId)
    }

    static async newTask(token,projectId,rawData) {
        const result = await TaskRepository.newTask(token,projectId,rawData);
        switch(result) {
            case 403 : {
                throw new AppError('you dont have permission to create new task', 403)
            }
            default : {
                return result;
            }
        }
    }

    static async setStateToTask(taskId,state) {
        const result = await TaskRepository.setStateToTask(taskId,state);
        return result;
    }

    static async updateTask(token,taskId,rawData) {
        const result = await TaskRepository.updateTask(token, taskId, rawData);
        switch( result) {
            case 403: {
                throw new AppError('you dont have a permission to update Task', 403)
            }
            default : {
                return result;
            }
        }
    }

    static async deleteTask(token,taskId) {
        const result = await TaskRepository.deleteTask(token,taskId);
        switch(result) {
            case 403 : {
                throw new AppError('you dont have a permission to delete task')
            }
            default : {
                return result;
            }
        }
    }
}