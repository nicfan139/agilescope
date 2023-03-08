import { Router } from 'express';
import { TeamController } from '../controllers';
import { checkAuth } from '../middleware';

const router = Router();

router.get('/teams', checkAuth, TeamController.getTeams);

router.get('/teams/:teamId', checkAuth, TeamController.getTeam);

router.post('/teams', checkAuth, TeamController.createTeam);

router.put('/teams/:teamId', checkAuth, TeamController.updateTeam);

export default router;
