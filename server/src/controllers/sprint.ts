import { Request, Response } from 'express';
import { Sprint } from '../models';

const SprintController = {
	getSprints: async (_req: Request, res: Response) => {
		const sprints = await Sprint.find();
		if (sprints) {
			res.status(200).json({
				sprints
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to return sprints'
			});
		}
	},

	getSprint: async (req: Request, res: Response) => {
		const { sprintId } = req.params;
		const sprint = await Sprint.findById(sprintId);
		if (sprint) {
			res.status(200).json({
				sprint
			});
		} else {
			res.status(400).json({
				errorMessage: `Sprint #${sprintId} does not exist`
			});
		}
	},

	createSprint: async (req: Request, res: Response) => {
		const sprint = await Sprint.create(req.body);
		if (sprint) {
			res.status(201).json({
				sprint
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to create new sprint'
			});
		}
	},

	updateSprint: async (req: Request, res: Response) => {
		const { sprintId } = req.params;
		const sprint = await Sprint.findByIdAndUpdate(sprintId, req.body, {
			returnDocument: 'after'
		});
		if (sprint) {
			res.status(200).json({ sprint });
		} else {
			res.status(500).json({
				errorMessage: 'Unable to update sprint'
			});
		}
	}
};

export default SprintController;
