const { z } = require('zod');

exports.taskScheme = z.object({
    title: z.string(),
    userId: z.number(),
    projectId : z.number()
})

