const { AppError } = require("../errors/AppError");
const { EventRepository } = require("../repositories/event.repository")

exports.EventService = class {
    static async getAll() {
        return await EventRepository.getAll()
    }

    static async getDayEvents(date) {
        return await EventRepository.getDayEvents(date);
    }

    static async newEvent(token,rawData) {
        const result = await EventRepository.newEvent(token, rawData);
        if(Array.isArray(result)) {
            throw new AppError(`users with this id not found\n ${result.join('\n')}`,404)
        }
        switch (result) {
            case 403 : {
                throw new AppError('you dont have permission to create event',403);
            }
            case 404 : {
                throw new AppError('team lead not found',404);
            }
            default : {
                return result;
            }
        }
    }

    static async updateEvent(rawData) {
        
        return await EventRepository.updateEvent(rawData);
    }
}