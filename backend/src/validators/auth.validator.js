const { z } = require('zod');

const registerScheme = z.object({
    name: z.string(),
    surname: z.string(),
    password: z.string().trim().min(8,"minimum is 8"),
    email: z.string().email(),
    phone: z.number()
})

const loginScheme = z.object({
    email:z.string().email(),
    password:z.string().trim().min(8,"minimum is 8")
})

module.exports = { registerScheme,loginScheme }