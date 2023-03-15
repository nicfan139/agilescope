import { Router } from 'express';
import { UserController } from '../controllers';
import { checkAuth } from '../middleware';

const router = Router();

router.get('/users', checkAuth, UserController.getUsers);

router.get('/users/:userId', checkAuth, UserController.getUser);

router.post('/users', UserController.createUser);

router.put('/users/:userId', checkAuth, UserController.updateUser);

router.get('/users/:userId/dashboard', checkAuth, UserController.getUserDashboard);

export default router;
