const { verifyToken } = require("../utils/jwt");
const { AppError } = require('../errors/AppError');
const { userModel } = require("../models/user.model");

exports.AuthMiddleware = class {
    static async isAdmin (req,res,next) {
        const headers = req.headers.authorization;
        if(!headers?.trim() || !headers.startsWith('Bearer ')) next(new AppError("define token!",401));
        const jwt = verifyToken(headers.split(' ')[1]);
        if(!jwt) next(new AppError('invalid token',401));
        const user = await userModel.findOne({ email:jwt.email });
        if(!user) next(new AppError('user with this token not found', 404));
        if(user.role != 'GOD' && user.role != 'TEAMLEAD') next(new AppError('you dont have a permission to do this operation', 403));
        next();
    }

    static async checkAdminByid (req,res,next) {
        const { teamLeadId } = req.body;
        if(!teamLeadId) next(new AppError('teamLeadId is not defined',400))
        const user = await userModel.findById(teamLeadId);
        if(!user) next(new AppError('team lead with this id not found',404))
        if(user.role != 'GOD' && user.role != 'TEAMLEAD') next(new AppError('you dont have a permission to do this operation', 403));
        next()
    }
}