const eventModel = require("../models/event.model");
const { userModel } = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");

exports.EventRepository = class {
    static async getAll() {
        return eventModel.find();
    }

    static async getDayEvents(date) {
        return eventModel.find({
            $expr: { $eq: ["created_at", date] }
        })
    }

    static async createEvent(token, rawData) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;
        const user = userModel.findOne({ email: jwt.email })
        if (!email) return 404;
        const whoNotFound = []
        for (const user of rawData.participants) {
            const result = await userModel.findByIdAndUpdate(user._id, {
                $push: { notifications: `${rawData.eventType} in ${rawData.date}` }
            }, { new: true })
            if (!result) whoNotFound.push(user._id);
        }
        if(whoNotFound) return whoNotFound;
        const event = new eventModel({ ...rawData, teamLeadId: user._id });
        return await event.save();
    }

    static async updateEvent(eventId, rawData) {
        return await eventModel.findByIdAndUpdate(eventId, rawData);
    }

    static async deleteEvent(eventId) {
        return await eventModel.findByIdAndDelete(eventId);
    }
}