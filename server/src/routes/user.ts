import { Router } from 'express';
import { UserController } from '../controllers';
import { checkAuth } from '../middleware';

const router = Router();

router.post('/users', checkAuth, UserController.createUser);

router.get('/users/:userId', checkAuth, UserController.getUser);

router.put('/users/:userId', checkAuth, UserController.updateUser);

export default router;
