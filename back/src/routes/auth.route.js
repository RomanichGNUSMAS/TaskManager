const { AuthController } = require('../controllers/auth.controller');
const { asyncHandler } = require('../utils/asyncHandler');

const router = require('express').Router();

router.post('/signin', asyncHandler(AuthController.signin))
router.post('/signup', asyncHandler(AuthController.signup))

exports.authRouter = router;