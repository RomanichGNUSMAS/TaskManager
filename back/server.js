const { default: mongoose } = require('mongoose');
const { app } = require('./src/app');
const { MONGO_URL } = require('./src/config/env');

(async function () {
    try {
        await mongoose.connect(MONGO_URL);
        app.listen(3000,() => {
            console.log("server is up on 3000")
        })
    }
    catch (err) {
        console.log(err);
    }

})()