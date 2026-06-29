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

    static setPhoto(rawData) {
        return UserRepository.setPhoto(rawData);
    }
}