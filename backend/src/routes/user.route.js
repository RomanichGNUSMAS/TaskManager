const { UserController } = require('../controllers/user.controller');
const { asyncHandler } = require('../utils/asyncHandler');
const { upload } = require('../utils/multer');

const router = require('express').Router({ mergeParams: true });

router.get('/:id',asyncHandler(UserController.getUser));
router.get('/role/:role',asyncHandler(UserController.getUsersByRole))
router.put('/:id',asyncHandler(UserController.updateUser));
router.post('/:id/message',asyncHandler(UserController.sendNotification))
router.patch('/:userId/notifications/:notificationId',asyncHandler(UserController.markAsReadNotification))
router.patch('/:id/avatar',upload.single('avatar'),asyncHandler(UserController.setPhoto))
router.patch('/:id/password',asyncHandler(UserController.changePassword))
router.delete('/:id', asyncHandler(UserController.deleteMyself));
router.delete('/:userId/notifications/:notificationId',asyncHandler(UserController.deleteNotification));

exports.userRouter = router;