import { Router } from 'express';
import { AuthController } from '../controllers';

const router = Router();

router.post('/auth/login', AuthController.login);

router.post('/auth/verify_email', AuthController.verifyEmail);

router.post('/auth/validate_otp', AuthController.validateOtp);

router.post('/auth/validate_token', AuthController.validateToken);

export default router;
