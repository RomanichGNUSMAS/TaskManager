const { TaskController } = require('../controllers/task.controller');
const { AuthMiddleware } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../utils/asyncHandler');

const router = require('express').Router();

router.get('/:id',TaskController.getOneTask)
router.post('/',AuthMiddleware.isAdmin,asyncHandler(TaskController.newTask))
router.patch('/:id/state',asyncHandler(TaskController.setState))
router.put('/:id/update', AuthMiddleware.isAdmin,asyncHandler(TaskController.updateTask))
router.delete('/:id', AuthMiddleware.isAdmin,asyncHandler(TaskController.deleteTask))

exports.taskRouter = router;