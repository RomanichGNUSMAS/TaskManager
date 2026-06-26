const { TaskService } = require('../services/task.service')

exports.TaskController = class {
    static async getAllForOneProject(req, res, next) {
        const { projectId } = req.params;
        const result = await TaskService.getAllOfProject(projectId)
        res.json(result);
    }

    static async getOneTask(req, res, next) {
        const { id } = req.params;
        const result = await TaskService.getOneTask(id);
        res.json(result);
    }

    static async newTask(req, res, next) {
        const data = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const result = await TaskService.newTask(token, data);
        res.status(201).json(result);
    }

    static async setState(req, res, next) {
        const [{ state }, { id }] = [req.body, req.params];
        const result = await TaskService.setStateToTask(id, state);
        res.sendStatus(204);
    }

    static async updateTask(req, res, next) {
        const { params: { id }, body, headers: { authorization } } = req;
        const result = await TaskService.updateTask(authorization.split(' ')[1], id, body);
        res.sendStatus(204);
    }

    static async deleteTask(req, res, next) {
        const { params : { id }, headers : { authorization } } = req;
        const result = await TaskService.deleteTask(authorization.split(' ')[1],id);
        res.json(result);
    }
}