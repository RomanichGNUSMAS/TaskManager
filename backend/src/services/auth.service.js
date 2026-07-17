const { AuthRepository } = require("../repositories/auth.repository");
const { registerScheme, loginScheme } = require("../validators/auth.validator")
const { AppError } = require('../errors/AppError')

exports.AuthService = class {
    static async signup(rawData) {
        console.log(rawData)
        const validation = registerScheme.safeParse(rawData);
        if (!validation.success) {
            throw new AppError(validation.error.issues[0]?.message ?? 'invalid credentials', 400);
        }
        return await AuthRepository.signup(validation.data);
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
                    throw new AppError("invalid name or password", 400)
                }

                default: {
                    throw new Error('case not found');
                }
            }
        }
        return result;
    }

    static async me(token) {
        if (!token?.trim()) throw new AppError('invalid token', 400);
        const result = await AuthRepository.me(token);
        switch (result) {
            case 403: {
                throw new AppError('you dont have permission to use this app', 403);
            }
            case 404: {
                throw new AppError('user not found', 404)
            }
            default: {
                return result;
            }
        }
    }
}