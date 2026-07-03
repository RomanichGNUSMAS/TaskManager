const { default: mongoose } = require("mongoose");
const eventModel = require("../models/event.model");
const { userModel } = require("../models/user.model");
const { verifyToken } = require("../utils/jwt");
const { AppError } = require("../errors/AppError");

exports.EventRepository = class {
    static _toObjectId(id) {
        const ObjectId = mongoose.Types.ObjectId;
        return id instanceof ObjectId ? id : new ObjectId(id);
    }

    static async _sendNotifications({ ids = [], teamLeadId, message }) {
        const recipientIds = [];

        if (Array.isArray(ids)) {
            recipientIds.push(...ids.map(id => this._toObjectId(id)));
        }
        if (teamLeadId) {
            recipientIds.push(this._toObjectId(teamLeadId));
        }

        const uniqueIds = [...new Set(recipientIds.map(id => id.toString()))].map(id => this._toObjectId(id));
        if (!uniqueIds.length) return;

        await userModel.updateMany(
            { _id: { $in: uniqueIds } },
            { $push: { notifications: message } },
        );
    }

    static async _buildEventNotification(event, action) {
        return {
            _id: new mongoose.Types.ObjectId(),
            text: `Event "${event.title}" ${action}`,
            isRead: false,
            createdAt: new Date(),
        };
    }

    static async getAll() {
        return eventModel.find();
    }

    static async getDayEvents(dateInput) {
        let dateStr = dateInput instanceof Date
            ? dateInput.toISOString()
            : String(dateInput).trim();

        const dateOnly = dateStr.substring(0, 10);

        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateOnly);
        if (!isValidFormat) {
            return 400;
        }

        const startOfDay = new Date(`${dateOnly}T00:00:00.000Z`);
        const endOfDay = new Date(`${dateOnly}T23:59:59.999Z`);

        return eventModel.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
    }

    static async createEvent(token, rawData) {
        const jwt = verifyToken(token);
        if (!jwt) return 403;

        const user = await userModel.findOne({ email: jwt.email });
        if (!user) return 404;
        const participantIds = rawData.participants.map(p => p._id || p);
        const existingCount = await userModel.countDocuments({ _id: { $in: participantIds } });
        if (existingCount !== participantIds.length) {
            const existingUsers = await userModel.find({ _id: { $in: participantIds } }, { _id: 1 });
            const existingIds = existingUsers.map(u => u._id.toString());
            const missingIds = participantIds.filter(id => !existingIds.includes(id.toString()));

            return missingIds;
        }
        const { _id, ...cleanRawData } = rawData;

        const event = new eventModel({
            ...cleanRawData,
            teamLeadId: new mongoose.Types.ObjectId(user._id),
            project: rawData.project ? {
                ...rawData.project,
                projectId: rawData.project.projectId ? new mongoose.Types.ObjectId(rawData.project.projectId) : undefined
            } : undefined
        });

        const savedEvent = await event.save();


        await userModel.updateMany({ _id: { $in: participantIds } },
            {
                $push: {
                    notifications: {
                        text: `${rawData.title}: ${rawData.eventType} in ${rawData.date}`,
                        eventId: new mongoose.Types.ObjectId(savedEvent._id)
                    }
                }
            }
        )
        const date = new Date(savedEvent.date)
        await this._sendNotifications({
            ids: participantIds,
            teamLeadId: savedEvent.teamLeadId,
            message: await this._buildEventNotification(savedEvent, `${savedEvent.eventType} on ${date.toLocaleDateString()}:${date.toLocaleTimeString()}`),
        });

        return savedEvent;
    }

    static async updateEvent(eventId, rawData) {
        const event = await eventModel.findById(this._toObjectId(eventId));
        if (!event) return null;

        const participantIds = Array.isArray(rawData.participants)
            ? rawData.participants.map(p => p._id || p)
            : event.participants;

        await userModel.findOneAndUpdate({ 'notifications.eventId': eventId }, {
            $set: {
                'notifications.$': {
                    text: `${rawData.title}: ${rawData.eventType} in ${rawData.date}`
                }
            }
        });

        const updatedEvent = await eventModel.findByIdAndUpdate(
            EventRepository._toObjectId(eventId),
            rawData,
            { new: true },
        );

        await EventRepository._sendNotifications({
            ids: participantIds,
            teamLeadId: updatedEvent.teamLeadId,
            message: await EventRepository._buildEventNotification(updatedEvent, 'was updated'),
        });

        return updatedEvent;
    }

    static async deleteEvent(eventId) {
        const event = await eventModel.findById(EventRepository._toObjectId(eventId));
        if (!event) return null;

        await userModel.updateMany({ 'notifications.eventId': eventId },
            {
                $pull: { notifications: { eventId: new mongoose.Types.ObjectId(eventId) } }
            }
        );

        const deleted = await eventModel.findByIdAndDelete(EventRepository._toObjectId(eventId));

        await EventRepository._sendNotifications({
            ids: event.participants,
            teamLeadId: event.teamLeadId,
            message: await EventRepository._buildEventNotification(event, 'was deleted'),
        });

        return deleted;
    }
}