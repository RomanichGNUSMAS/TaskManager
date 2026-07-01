require('dotenv').config({ quiet:true });

exports.MONGO_URL = process.env.MONGO_URL;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES_TIME = process.env.JWT_EXPIRES_TIME