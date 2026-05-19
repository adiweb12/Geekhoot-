import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from './auth.controller';
import { validate } from '../common/middleware/validate.middleware';
import { authenticate } from '../common/middleware/auth.middleware';

const router = Router();

const signupValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

const loginValidators = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', signupValidators, validate, authController.signup);
router.post('/login', loginValidators, validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getMe);

export default router;
