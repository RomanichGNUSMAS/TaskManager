const { default: z } = require("zod");

exports.eventScheme = z.object({ 
    title : z.string(),
    project : z.string(),
    location : z.string().optional(),
    date: z.date(),
    link: z.string().optional(),
    teamLeadId:z.number(),
    eventType: z.string()
})