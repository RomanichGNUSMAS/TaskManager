const { EventController } = require('../controllers/event.controller');
const { AuthMiddleware } = require('../middlewares/auth.middleware')
const { asyncHandler } = require('../utils/asyncHandler')

const router = require('express').Router();


router.get('/', EventController.getAll);
router.post('/bydate', asyncHandler(EventController.getAllForDay));
router.post('/', AuthMiddleware.checkAdminByid ,AuthMiddleware.isAdmin, asyncHandler(EventController.newEvent));
router.put('/:id',AuthMiddleware.checkAdminByid , AuthMiddleware.isAdmin, asyncHandler(EventController.updateEvent));
router.delete('/:id',AuthMiddleware.checkAdminByid , AuthMiddleware.isAdmin, asyncHandler(EventController.deleteEvent))

exports.eventRouter = router;