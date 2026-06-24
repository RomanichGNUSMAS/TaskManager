const { verifyToken } = require('../utils/jwt')
const { userModel } = require('../models/user.model')
const { projectModel } = require('../models/project.model')

exports.ProjectRepository = class {
    static getAll() {
        return projectModel.find()
    }

    static async getById(projectId) {
        const project = await projectModel.findOne({ id: projectId });
        if (!project) return null;
        return project;
    }
    static async newProject(token, rawData) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        const project = new projectModel({ ...rawData, teamLeadId: user.id });
        return await project.save()
    }

    static async updateProject(token, rawData, projectId, role = 'user') {
        if (role !== 'auto') {
            const jwt = verifyToken(token);
            if (!jwt) return 403;
            const user = userModel.findOne({ email: jwt.email });
            if (!user) return 404;
        }
        const project = await projectModel.findByIdAndUpdate(projectId, rawData)
    }

    static async removeProject(token, projectId) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        return await projectModel.findOneAndDelete({ id: projectId });
    }

    static async favoriteProject(token, projectId) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        await projectModel.findByIdAndUpdate(projectId, {
            $push: { favoritedBy: user._id }
        })
    }
}