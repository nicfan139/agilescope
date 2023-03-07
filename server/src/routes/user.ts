import { Router } from 'express';
import { UserController } from '../controllers';

const router = Router();

router.post('/users/create', UserController.createUser);

router.get('/users/:userId', UserController.getUser);

router.put('/users/:userId', UserController.updateUser);

export default router;
