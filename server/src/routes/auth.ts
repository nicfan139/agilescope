import { Router } from 'express';
import { AuthController } from '../controllers';

const router = Router();

router.post('/login', AuthController.login);

router.post('/verify_email', AuthController.verifyEmail);

router.post('/validate_otp', AuthController.validateOtp);

router.post('/validate_token', AuthController.validateToken);

export default router;