const { UserService } = require("../services/user.service")

exports.UserController = class {
    static async getUser(req,res,next) {
        const result = await UserService.getUserById(req.params.id);
        return res.json(result);
    }  
    static async updateUser(req,res,next) {
        const result = await UserService.updateUser(req.params.id,req.body);
        return res.sendStatus(204);
    }

    static async deleteMyself(req,res,next) {
        const result = await UserService.deleteMyself(req.params.body);
        return res.json(result);
    }

    static async setPhoto(req,res,next) {
        const { file } = req;
        const id = req.params.id;
        const result = await UserService.setPhoto(file.filename,id);
        return res.sendStatus(204)
    }

    static async getUsersByRole(req,res,next) {
        const { role } = req.params;
        const result = await UserService.getUsersByRole(role);
        return res.json(result)
    }

    static async changePassword(req,res,next) {
        const {params : { id }, body : passwords } = req;
        const result = await UserService.changePassword(passwords,id)
        return res.sendStatus(204)
    }

    static async sendNotification(req,res,next) {
        const { params : { id }} = req;
        const result = await UserService.sendNotificaion(id,req.body.message)
    }
}