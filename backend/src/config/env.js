require('dotenv').config({ quiet:true });

exports.MONGO_URL = process.env.MONGO_URL;
exports.JWT_SECRET = process.env.JWT_SECRET;