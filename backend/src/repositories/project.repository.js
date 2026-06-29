const { verifyToken } = require('../utils/jwt')
const { default: mongoose } = require('mongoose')
const { userModel } = require('../models/user.model')
const { projectModel } = require('../models/project.model')
const { taskModel } = require('../models/task.model')

exports.ProjectRepository = class {
    static async getAll(limit, page) {
        const totalProjects = await projectModel.countDocuments();
        const totalActive = await projectModel.countDocuments({ state: 'active' });
        const projects = await projectModel.find()
            .skip(page * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalProjects / limit);

        return {
            totalActive,
            totalProjects,
            totalPages: totalPages || 1,
            projects
        }
    }

    static async getById(projectId) {
        return await projectModel.findOne({ _id: new mongoose.Types.ObjectId(projectId) });
    }
    static async newProject(token, rawData) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        const project = new projectModel(rawData);
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
        const mongooseId = new mongoose.Types.ObjectId(projectId)
        if (!jwt) return 403;
        const user = userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        await taskModel.deleteMany({ projectId: mongooseId })
        return await projectModel.findOneAndDelete({ _id: mongooseId });
    }

    static async favoriteProject(token, projectId) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        await projectModel.findByIdAndUpdate(projectId, {
            $push: { favoritedBy: new mongoose.Types.ObjectId(user._id) }
        })
    }
}