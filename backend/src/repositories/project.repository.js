const { verifyToken } = require('../utils/jwt')
const { default: mongoose } = require('mongoose')
const { userModel } = require('../models/user.model')
const { projectModel } = require('../models/project.model')
const { taskModel } = require('../models/task.model')

exports.ProjectRepository = class {
    static _toObjectId(id) {
        const ObjectId = mongoose.Types.ObjectId;
        return id instanceof ObjectId ? id : new ObjectId(id);
    }

    static async _sendNotifications({ ids = [], teamLeadId, message }) {
        const recipientIds = [];

        if (Array.isArray(ids)) {
            recipientIds.push(...ids.map(id => ProjectRepository._toObjectId(id)));
        }
        if (teamLeadId) {
            recipientIds.push(ProjectRepository._toObjectId(teamLeadId));
        }

        const uniqueIds = [...new Set(recipientIds.map(id => id.toString()))].map(id => ProjectRepository._toObjectId(id));
        if (!uniqueIds.length) return;

        await userModel.updateMany(
            { _id: { $in: uniqueIds } },
            { $push: { notifications: message } },
        );
    }

    static async _buildProjectNotification(project, action) {
        return {
            _id: new mongoose.Types.ObjectId(),
            text: `Project "${project.name}" ${action}`,
            isRead: false,
            createdAt: new Date(),
        };
    }

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
        return await projectModel.findOne({ _id: ProjectRepository._toObjectId(projectId) });
    }

    static async newProject(token, rawData) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = await userModel.findOne({ email: jwt.email });
        if (!user) return 404;

        const project = new projectModel(rawData);
        const savedProject = await project.save();

        await ProjectRepository._sendNotifications({
            teamLeadId: savedProject.teamLeadId,
            message: await ProjectRepository._buildProjectNotification(savedProject, 'was created'),
        });

        return savedProject;
    }

    static async updateProject(token, rawData, projectId, role = 'user') {
        if (role !== 'auto') {
            const jwt = verifyToken(token);
            if (!jwt) return 403;
            const user = await userModel.findOne({ email: jwt.email });
            if (!user) return 404;
        }

        const project = await projectModel.findByIdAndUpdate(
            ProjectRepository._toObjectId(projectId),
            rawData,
            { new: true },
        );
        if (!project) return null;

        await ProjectRepository._sendNotifications({
            teamLeadId: project.teamLeadId,
            message: await ProjectRepository._buildProjectNotification(project, 'was updated'),
        });

        return project;
    }

    static async removeProject(token, projectId) {
        const jwt = verifyToken(token);
        const mongooseId = ProjectRepository._toObjectId(projectId);
        if (!jwt) return 403;
        const user = await userModel.findOne({ email: jwt.email });
        if (!user) return 404;

        const project = await projectModel.findById(mongooseId);
        if (!project) return null;

        await taskModel.deleteMany({ projectId: mongooseId });
        await projectModel.findByIdAndDelete(mongooseId);

        await ProjectRepository._sendNotifications({
            teamLeadId: project.teamLeadId,
            message: await ProjectRepository._buildProjectNotification(project, 'was deleted'),
        });

        return project;
    }

    static async favoriteProject(token, projectId) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = await userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        await projectModel.findByIdAndUpdate(projectId, {
            $push: { favoritedBy: new mongoose.Types.ObjectId(user._id) }
        })
    }
}