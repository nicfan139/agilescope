import { Request, Response } from 'express';
import { Project } from '../models';

const ProjectController = {
	getProjects: async (_req: Request, res: Response) => {
		const projects = await Project.find();
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
		const project = await Project.findById(projectId);
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
			returnDocument: 'after'
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
		try {
			await Project.findByIdAndDelete(projectId);
			res.status(204).json(null);
		} catch (e: unknown) {
			const error = e as Error;
			console.log(error);
			res.status(500).json({
				errorMessage: `Unable to delete project: ${error.message}`
			});
		}
	}
};

export default ProjectController;
