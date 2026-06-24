const { AuthRepository } = require("../repositories/auth.repository");
const { registerScheme, loginScheme } = require("../validators/auth.validator")
const { AppError } = require('../errors/AppError')

exports.AuthService = class {
    static async signup(rawData) {
        const validation = registerScheme.safeParse(rawData);
        if (!validation) throw new AppError('invalid credentials', 400)
        const result = await AuthRepository.signup(rawData);
        if (!result) {
            throw new AppError('user already exists', 409)
        }
        return result;
    }

    static async signin(rawData) {
        const validation = loginScheme.safeParse(rawData);
        if (!validation) throw new AppError('invalid credentials', 400)
        const result = await AuthRepository.signin(rawData);
        if (typeof result === "number") {
            switch (result) {
                case 404: {
                    throw new AppError("user not found", 404);
                }

                case 400: {
                    throw new AppError("invalid name or password")
                }

                default: {
                    throw new Error('case not found');
                }
            }
        }
        return result;
    }
}