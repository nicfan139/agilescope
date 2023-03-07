import { Router } from 'express';
import { TaskController } from '../controllers';
import { checkAuth } from '../middleware';

const router = Router();

router.get('/tasks', checkAuth, TaskController.getTasks);

router.get('/tasks/:taskId', checkAuth, TaskController.getTask);

router.post('/tasks', checkAuth, TaskController.createTask);

router.post('/tasks/:taskId/subtasks', checkAuth, TaskController.createSubtask);

router.put('/tasks/:taskId', checkAuth, TaskController.updateTask);

router.delete('/tasks/:taskId', checkAuth, TaskController.deleteTask);

export default router;
