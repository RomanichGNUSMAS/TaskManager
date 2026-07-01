const { ProjectController } = require('../controllers/project.controller');
const { TaskController } = require('../controllers/task.controller');
const { AppError } = require('../errors/AppError');
const { AuthMiddleware } = require('../middlewares/auth.middleware')
const { asyncHandler } = require('../utils/asyncHandler')

const router = require('express').Router();

router.get('/',ProjectController.getAll);
router.get('/:id',asyncHandler(ProjectController.getById));
router.get('/:projectId/tasks',TaskController.getAllForOneProject);
router.post('/',AuthMiddleware.checkAdminByid ,AuthMiddleware.isAdmin, asyncHandler(ProjectController.newProject));
router.put('/:id',AuthMiddleware.isAdmin, asyncHandler(ProjectController.updateProject));
router.put('/:id/favorite',ProjectController.favoriteProject);
router.delete('/:id',AuthMiddleware.isAdmin, asyncHandler(ProjectController.deleteProject))

exports.projectRouter = router;