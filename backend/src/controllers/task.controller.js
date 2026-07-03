const { TaskService } = require('../services/task.service')

exports.TaskController = class {
    static async getAllForOneProject(req, res, next) {
        const { projectId } = req.params;
        const result = await TaskService.getAllOfProject(projectId)
        return res.json(result);
    }

    static async getOneTask(req, res, next) {
        const { id } = req.params;
        const result = await TaskService.getOneTask(id);
        return res.json(result);
    }

    static async newTask(req, res, next) {
        const data = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const result = await TaskService.newTask(token, data);
        return res.status(201).json(result);
    }

    static async setState(req, res, next) {
        const { params : { id }, body : { state }} = req;
        const result = await TaskService.setStateToTask(id, state);
        return res.sendStatus(204);
    }

    static async updateTask(req, res, next) {
        const { params: { id }, body, headers: { authorization } } = req;
        const result = await TaskService.updateTask(authorization.split(' ')[1], id, body);
        return res.sendStatus(204);
    }

    static async deleteTask(req, res, next) {
        const { params : { id }, headers : { authorization } } = req;
        const result = await TaskService.deleteTask(authorization.split(' ')[1],id);
        return res.json(result);
    }

    static async deleteSubtask(req,res,next) {
        const { params : { taskId,subtaskId}} = req;
        await TaskService.deleteSubtask(taskId,subtaskId);
        return res.sendStatus(204)
    }
}