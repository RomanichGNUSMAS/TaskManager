const express = require('express');
const path = require('node:path')
const { authRouter } = require('./routes/auth.route');
const { projectRouter } = require('./routes/project.route');
const { errorMiddleware } = require('./middlewares/error.middleware');
const { taskRouter } = require('./routes/task.route');
const { eventRouter } = require('./routes/event.route');
const { userRouter } = require('./routes/user.route');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use('/', express.static(path.join(__dirname, '..', 'uploads')));
app.options('/*any', cors()); 

app.use(express.json())
app.use('/auth',authRouter);
app.use('/projects',projectRouter)
app.use('/tasks',taskRouter)
app.use('/events',eventRouter);
app.use('/users',userRouter)

app.use(errorMiddleware)
exports.app = app;