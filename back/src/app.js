const express = require('express');
const { authRouter } = require('./routes/auth.route');
const { projectRouter } = require('./routes/project.route');
const { errorMiddleware } = require('./middlewares/error.middleware');
const { taskRouter } = require('./routes/task.route');
const { eventRouter } = require('./routes/event.route');
const app = express();

app.use(express.json());

app.use('/auth',authRouter);
app.use('/projects',projectRouter)
app.use('/tasks',taskRouter)
app.use('/events',eventRouter);

app.use(errorMiddleware)
exports.app = app;