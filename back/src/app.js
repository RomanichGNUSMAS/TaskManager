const express = require('express');
const { authRouter } = require('./routes/auth.route');
const { projectRouter } = require('./routes/project.route');
const app = express();

app.use(express.json());

app.use('/auth',authRouter);
app.use('/projects',projectRouter)

exports.app = app;