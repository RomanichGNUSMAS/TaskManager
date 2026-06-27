const { AppError } = require("../errors/AppError");
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
    static async me(req,res,next) {
        const { headers : { authorization }} = req;
        if(!authorization?.trim() || !authorization.startsWith('Bearer '))
            return next(new AppError('invalid token', 400))
        const result = await AuthService.me(authorization.split(' ')[1])
        res.json(result);
    }
}