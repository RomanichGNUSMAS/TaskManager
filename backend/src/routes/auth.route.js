const { AuthController } = require('../controllers/auth.controller');
const { AuthMiddleware } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../utils/asyncHandler');

const router = require('express').Router();

router.get('/me', asyncHandler(AuthController.me))
router.post('/signin', asyncHandler(AuthController.signin))
router.post('/signup',asyncHandler(AuthController.signup))

exports.authRouter = router;