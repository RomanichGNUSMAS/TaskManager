const { EventService } = require("../services/event.service")

exports.EventController = class {
    static async getAll(req, res, next) {
        const result = await EventService.getAll();
        return res.json(result)
    }
    static async getAllForDay(req, res, next) {
        const { body: { date } } = req;
        const result = await EventService.getDayEvents(date);
        return res.json(result);
    }
    static async newEvent(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        const { body } = req;
        const result = await EventService.newEvent(token, body);
        return res.status(201).json(result);
    }
    static async updateEvent(req, res, next) {
        const { params: { id } } = req;
        const { body } = req;
        const result = await EventService.updateEvent(id, body);
        res.sendStatus(204)
    }
    static async deleteEvent(req, res, next) {
        const { params: { id } } = req;
        const result = await EventService.deleteEvent(id);
        res.json(result);
    }
}