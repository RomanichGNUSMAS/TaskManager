const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')

function createKey(email) {
    return jwt.sign({ email }, JWT_SECRET);
}

function verifyToken(token) {
    try {
        const payload = jwt.verify(token,JWT_SECRET);
        return payload;
    } catch (err) {
        console.log(err.message)
        return null;
    }
}

module.exports = { createKey, verifyToken };