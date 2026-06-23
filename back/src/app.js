const express = require('express');
const { authRouter } = require('./routes/auth.route');
const app = express();

app.use(express.json());

app.use('/auth',authRouter);

exports.app = app;