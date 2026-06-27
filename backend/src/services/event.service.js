const { AppError } = require("../errors/AppError");
const { EventRepository } = require("../repositories/event.repository");
const { eventScheme } = require("../validators/event.validator");

exports.EventService = class {
    static async getAll() {
        return await EventRepository.getAll()
    }

    static async getDayEvents(date) {
        const new_date = new Date(date);
        try {
            new_date.toISOString()
        } catch {
            throw new AppError('invalid date', 400)
        }
        return await EventRepository.getDayEvents(new_date);
    }

    static async newEvent(token,rawData) {
        const validation = eventScheme.safeParse(rawData);
        if(!validation) throw new AppError('invalid credentials', 400);
        if(rawData?.participants && rawData.participants.length <= 0) throw new AppError('cannot create event without participants', 400);
        const result = await EventRepository.createEvent(token, rawData);
        if(Array.isArray(result) && result.length > 0) {
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

    static async updateEvent(eventId,rawData) {
        return await EventRepository.updateEvent(eventId,rawData);
    }

    static async deleteEvent(eventId) {
        return await EventRepository.deleteEvent(eventId) 
    }
}