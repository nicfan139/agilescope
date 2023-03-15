import { Request, Response } from 'express';
import { Project, Task } from '../models';
import { USER_FIELDS } from '../utils';

const ProjectController = {
	getProjects: async (_req: Request, res: Response) => {
		const projects = await Project.find()
			.sort({ createdAt: 'desc' })
			.populate('createdBy', USER_FIELDS)
			.populate('members', USER_FIELDS);
		if (projects) {
			res.status(200).json({
				projects
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to return projects'
			});
		}
	},

	getProject: async (req: Request, res: Response) => {
		const { projectId } = req.params;
		const project = await Project.findById(projectId, null, { lean: true })
			.populate('createdBy', USER_FIELDS)
			.populate('members', USER_FIELDS)
			.populate('tasks');
		if (project) {
			res.status(200).json({
				project
			});
		} else {
			res.status(400).json({
				errorMessage: `Project #${projectId} does not exist`
			});
		}
	},

	createProject: async (req: Request, res: Response) => {
		const project = await Project.create(req.body);
		if (project) {
			res.status(201).json({
				project
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to create new project'
			});
		}
	},

	updateProject: async (req: Request, res: Response) => {
		const { projectId } = req.params;
		const project = await Project.findByIdAndUpdate(projectId, req.body, {
			returnDocument: 'after',
			lean: true
		});
		if (project) {
			res.status(200).json({ project });
		} else {
			res.status(500).json({
				errorMessage: 'Unable to update project'
			});
		}
	},

	deleteProject: async (req: Request, res: Response) => {
		const { projectId } = req.params;
		const project = await Project.findById(projectId);

		if (project) {
			try {
				await Promise.all(
					project.tasks.map(async (t) => {
						await Task.findByIdAndUpdate(t._id, {
							project: null
						});
					})
				);

				await Project.findByIdAndDelete(projectId);
				res.status(204).json(null);
			} catch (e: unknown) {
				const error = e as Error;
				console.log(error);
				res.status(500).json({
					errorMessage: `Unable to delete project: ${error.message}`
				});
			}
		} else {
			res.status(400).json({
				errorMessage: `Project #${projectId} does not exist`
			});
		}
	}
};

export default ProjectController;
