const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_TIME } = require('../config/env')

function createKey(email) {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });
}

function verifyToken(token) {
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return payload;
    } catch (err) {
        console.log(err.message)
        return null;
    }
}

module.exports = { createKey, verifyToken };