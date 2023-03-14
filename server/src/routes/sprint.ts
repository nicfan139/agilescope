import { Router } from 'express';
import { SprintController } from '../controllers';
import { checkAuth } from '../middleware';

const router = Router();

router.get('/sprints', checkAuth, SprintController.getSprints);

router.post('/sprints', checkAuth, SprintController.createSprint);

router.put('/sprints/:sprintId', checkAuth, SprintController.updateSprint);

export default router;
