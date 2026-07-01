const { default: mongoose } = require("mongoose");
const { userModel } = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");
const { upload } = require("../utils/multer");
const { merge } = require('lodash')

exports.UserRepository = class {
    static async getUserById(id) {
        return await userModel.findById(id);
    }

    static async updateUser(id, rawData) {
        if (!id || typeof id === 'object') {
            throw new Error("Invalid User ID");
        }
        const dataToUpdate = rawData ? { ...rawData } : {};

        const user = await userModel.findById(id);
        if (!user) {
            return null;
        }

        const protectedFields = ['notifications', 'tasks', 'projects', 'password'];
        for (const field of protectedFields) {
            delete dataToUpdate[field];
        }

        user.set(dataToUpdate);

        return await user.save();
    }

    static async getUsersByRole(role) {
        return await userModel.find({ role });
    }

    static async setPhoto(rawData) {
        upload(rawData);
    }

    static async deleteMyself(id) {
        return await userModel.findByIdAndDelete(id);
    }
}