const { default: mongoose } = require("mongoose");
const { userModel } = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");
const { upload } = require("../utils/multer");
const { merge } = require('lodash');
const { comparePassword, hashPassword } = require("../utils/bcrypt");

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

    static async setPhoto(rawData, id) {
        return await userModel.findByIdAndUpdate(id, {
            $set: { avatar: rawData }
        })
    }

    static async deleteMyself(id) {
        return await userModel.findByIdAndDelete(id);
    }

    static async changePassword(rawData, userId) {
        const user = await userModel.findById(userId)
        if (!user) return 404;
        const passChangePermission = await comparePassword(rawData.current, user.password)
        if (!passChangePermission) return 403;
        const newHashedPassword = await hashPassword(rawData.new);
        await userModel.findByIdAndUpdate(userId, {
            $set: { password: newHashedPassword }
        })
    }

    static async sendNotification(userId, message) {
        return await userModel.findByIdAndUpdate(userId, {
            $push: { notifications: message }
        })
    }

    static async markNotificaionAsRead(userId, notificationId) {
        const ObjectId = mongoose.Types.ObjectId
        return await userModel.updateOne({
            _id: new ObjectId(userId),
            'notifications._id': new ObjectId(notificationId)
        }, {
            $set: { 'notifications.$.isRead': true }
        }, { new: true })
    }

    static async deleteNotification(userId, notificationId) {
        const ObjectId = mongoose.Types.ObjectId
        return await userModel.updateOne({
            _id : new ObjectId(userId)
        }, {
            $pull : {
                notifications : {
                    _id : new ObjectId(notificationId)
                }
            }
        })
    }
}