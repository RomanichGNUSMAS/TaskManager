const { AppError } = require("../errors/AppError");
const { default: mongoose, mongo } = require("mongoose");
const { ProjectRepository } = require("../repositories/project.repository");
const { userModel } = require("../models/user.model")
const { projectScheme } = require("../validators/project.validator")

exports.ProjectService = class {
    static async getAll() {
        return await ProjectRepository.getAll();
    }

    static async getById(projectId) {
        const project = await ProjectRepository.getById(projectId);
        if (!project) { throw new AppError('project not found', 404); }
        return project;
    }
    static async newProject(token, rawData) {
        const validation = projectScheme.safeParse(rawData);
        const mongoID = new mongoose.Types.ObjectId(rawData.teamLeadId)
        const user = await userModel.findOne({ _id: mongoID })
        console.log(mongoID)
        if (!user || (user.role !== 'GOD' && user.role != 'TEAMLEAD'))
            throw new AppError('you dont have permission to create project')
        if (!validation) throw new AppError('invalid credentials', 400)
        const result = await ProjectRepository.newProject(token, {
            ...rawData,
            teamLeadId: mongoID
        }); switch (result) {
            case 403: {
                throw new AppError('you don\'t have permission to create new Project', 404)
            }
            case 404: {
                throw new AppError('team lead not found', 404)
            }
            default: {
                return result;
            }
        }
    }

    static async updateProject(token, rawData, projectId) {
        const result = await ProjectRepository.updateProject(token, rawData, projectId);
        switch (result) {
            case 403: {
                throw new AppError('you don\'t have permission to update a project', 403);
            }
            case 404: {
                throw new AppError('team lead not found', 404)
            }
            default: {
                return result;
            }
        }
    }

    static async favorite(token, projectId) {
        const result = await ProjectRepository.favoriteProject(token, projectId);
        switch (result) {
            case 403: {
                throw new AppError('you cannot favorite project without token', 403);
            }
            case 404: {
                throw new AppError('user not found', 404);
            }
        }
    }

    static async deleteProject(token, projectId) {
        const result = await ProjectRepository.removeProject(token, projectId);
        switch (result) {
            case 403: {
                throw new AppError('you havent permission to delete a project', 403);
            }
            case 404: {
                throw new AppError('team lead not found');
            }
            default: {
                return result;
            }
        }
    }
}