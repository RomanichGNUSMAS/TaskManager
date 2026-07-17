const { default: mongoose } = require("mongoose");
const { userModel } = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { createKey, verifyToken } = require("../utils/jwt");

exports.AuthRepository = class {
    static async signup(rawData) {
        const found = await userModel.findOne({ email: rawData.email });
        if (found) throw new AppError('user already exists', 409);

        const godCount = await userModel.countDocuments({ role: 'GOD' });
        const role = godCount === 0 ? 'GOD' : (rawData.role ?? 'EMPLOYEE');

        const user = new userModel({
            ...rawData,
            role,
            password: await hashPassword(rawData.password),
        });
        return await user.save();
    }

    static async signin(rawData) {
        const found = await userModel.findOne({ email: rawData.email });
        if (!found) return 404;
        const compareResult = await comparePassword(rawData.password, found.password);
        if (!compareResult) return 400;
        return createKey(found.email);
    }

    static async me(token) {
        const jwt = verifyToken(token)
        if (!jwt) return 403;
        const user = await userModel.findOne({ email: jwt.email })
        if (!user) return 404;
        return user;
    }
}


