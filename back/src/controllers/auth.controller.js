const { AuthService } = require("../services/auth.service")

exports.AuthController = class {
    static async signup(req,res,next) {
        const result = await AuthService.signup(req.body);
        res.status(201).json(result);
    }

    static async signin(req,res,next) {
        const result = await AuthService.signin(req.body);
        res.json(result);
    }
}