const { AppError } = require("../errors/AppError")
const { UserRepository } = require("../repositories/user.repository")

exports.UserService = class {
    static async getUserById(id) {
        return await UserRepository.getUserById(id)
    }

    static async updateUser(id,data) {
        const result = await UserRepository.updateUser(id,data)
        if(!result) throw new AppError('user not found', 404);
    }

    static async deleteMyself(id) {
        const result = await UserRepository.deleteMyself(id);
        if(!result) throw new AppError('user not found', 404);
        return result;
    }

    static setPhoto(rawData,id) {
        return UserRepository.setPhoto(rawData,id);
    }

    static async getUsersByRole(role) { 
        return UserRepository.getUsersByRole(role)
    }

    static async changePassword(rawData,userId) {
        if(rawData.new !== rawData.completeNew) throw new AppError('different password of new and complete new', 400);
        const result = await UserRepository.changePassword(rawData,id);
        switch(result) {
            case 404 : {
                throw new AppError('user not found', 404);
            }
            case 403 : {
                throw new AppError('invalid current password', 403)
            }
        }
    }

    static async sendNotificaion(userId,message) {
        return await UserRepository.sendNotification(userId,message)
    }
}