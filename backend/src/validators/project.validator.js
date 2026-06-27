const { z } = require('zod');

exports.projectScheme = z.object({
    name: z.string(),
    state: z.string().optional(),
    teamLeadId: z.number()
})