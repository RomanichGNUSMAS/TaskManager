const mongoose = require('mongoose');
const { MONGO_URL } = require('./env');


(async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('db connected')
    } catch (err) {
        console.log(err.message)
    }
})();