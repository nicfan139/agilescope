import { Request, Response } from 'express';
import { Team } from '../models';

const TeamController = {
	getTeams: async (_req: Request, res: Response) => {
		const teams = await Team.find();
		if (teams) {
			res.status(200).json({
				teams
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to return teams'
			});
		}
	},

	getTeam: async (req: Request, res: Response) => {
		const { teamId } = req.params;
		const team = await Team.findById(teamId, null, { lean: true, populate: 'members' });
		if (team) {
			res.status(200).json({
				team
			});
		} else {
			res.status(400).json({
				errorMessage: `Team #${teamId} does not exist`
			});
		}
	},

	createTeam: async (req: Request, res: Response) => {
		const team = await Team.create(req.body);
		if (team) {
			res.status(201).json({
				team
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to create new team'
			});
		}
	},

	updateTeam: async (req: Request, res: Response) => {
		const { teamId } = req.params;
		const team = await Team.findByIdAndUpdate(teamId, req.body, {
			returnDocument: 'after',
			lean: true
		});
		if (team) {
			res.status(200).json({ team });
		} else {
			res.status(500).json({
				errorMessage: 'Unable to update team'
			});
		}
	}
};

export default TeamController;
