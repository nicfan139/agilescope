import { Router } from 'express';
import { ProjectController } from '../controllers';
import { checkAuth } from '../middleware';

const router = Router();

router.get('/projects', checkAuth, ProjectController.getProjects);

router.get('/projects/:projectId', checkAuth, ProjectController.getProject);

router.post('/projects', checkAuth, ProjectController.createProject);

router.put('/projects/:projectId', checkAuth, ProjectController.updateProject);

router.delete('/projects/:projectId', checkAuth, ProjectController.deleteProject);

export default router;
