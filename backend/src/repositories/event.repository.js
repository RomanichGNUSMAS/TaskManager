const { default: mongoose } = require("mongoose");
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

        const user = await userModel.find({ email: jwt.email })
        if (!user) return 404;
        const participantIds = rawData.participants.map(p => p._id || p);
        const existingCount = await userModel.countDocuments({ _id: { $in: participantIds } });
        if (existingCount !== participantIds.length) {
            const existingUsers = await userModel.find({ _id: { $in: participantIds } }, { _id: 1 });
            const existingIds = existingUsers.map(u => u._id.toString());
            const missingIds = participantIds.filter(id => !existingIds.includes(id.toString()));

            return missingIds;
        }
        const event = new eventModel({ ...rawData, teamLeadId: new mongoose.Types.ObjectId(user._id) });

        await userModel.updateMany({ _id: { $in: participantIds } },
            {
                $push: {
                    notifications: {
                        text: `${rawData.title}: ${rawData.eventType} in ${rawData.date}`,
                        eventId: new mongoose.Types.ObjectId(event._id)
                    }
                }
            }
        )
        return await event.save()
    }

    static async updateEvent(eventId, rawData) {
        await userModel.findOneAndUpdate({ 'notifications.eventId': eventId }, {
            $set: {
                'notifications.$': {
                    text: `${rawData.title}: ${rawData.eventType} in ${rawData.date}`
                }
            }
        });
        return await eventModel.findByIdAndUpdate(eventId, rawData);
    }

    static async deleteEvent(eventId) {
        await userModel.updateMany({ 'notifications.eventId' : eventId },
            {
                $pull : { notifications : { eventId:new mongoose.Types.ObjectId(eventId) }}
            }
        )
        return await eventModel.findByIdAndDelete(eventId);
    }
}