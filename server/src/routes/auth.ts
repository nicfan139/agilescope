import { Router } from 'express';
import { AuthController } from '../controllers';
import { checkAuth } from '../middleware';

const router = Router();

router.post('/auth/login', AuthController.login);

router.post('/auth/verify_email', AuthController.verifyEmail);

router.post('/auth/validate_otp', AuthController.validateOtp);

router.get('/auth/validate_token', checkAuth, AuthController.validateToken);

export default router;
