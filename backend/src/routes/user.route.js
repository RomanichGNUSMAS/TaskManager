const { UserController } = require('../controllers/user.controller');
const { asyncHandler } = require('../utils/asyncHandler');

const router = require('express').Router();

router.get('/:id',asyncHandler(UserController.getUser));
router.get('/role/:role',asyncHandler(UserController.getUsersByRole))
router.put('/:id',asyncHandler(UserController.updateUser));
router.patch('/:id/avatar',asyncHandler(UserController.setPhoto))
router.delete('/:id', asyncHandler(UserController.deleteMyself));

exports.userRouter = router;