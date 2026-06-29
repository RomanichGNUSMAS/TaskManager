const { ProjectService } = require('../services/project.service')

exports.ProjectController = class {
    static async getAll(req,res,next) {
        const result = await ProjectService.getAll(req.query);
        res.json(result)
    }

    static async getById(req,res,next) {
        const result = await ProjectService.getById(req.params.id);
        res.json(result)
    }

    static async newProject(req,res,next) {
        const data = req.body;
        const token = req.headers.authorization.split(' ')[1]
        const result = await ProjectService.newProject(token, data);
        res.status(201).json(result);
    }

    static async updateProject(req,res,next) {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const result = await ProjectService.updateProject(token, req.body, id);
        res.sendStatus(204)
    }

    static async favoriteProject(req,res,next) {
        const token = req.headers.authorization.split(' ')[1];
        const { id } = req.params;
        const result = await ProjectService.favorite(token, id);
        res.sendStatus(204);
    }

    static async deleteProject(req,res,next) {
        const token = req.headers.authorization.split(' ')[1];
        const { id } = req.params;
        const result = await ProjectService.deleteProject(token, id);
        res.json(result);
    }
}