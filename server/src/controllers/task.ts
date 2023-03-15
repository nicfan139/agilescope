import { Request, Response } from 'express';
import { Task, Project, Sprint } from '../models';
import { USER_FIELDS } from '../utils';

const TaskController = {
	getTasks: async (_req: Request, res: Response) => {
		const tasks = await Task.find()
			.sort({ createdAt: 'desc' })
			.populate('createdBy', USER_FIELDS)
			.populate('assignedTo', USER_FIELDS);
		if (tasks) {
			res.status(200).json({
				tasks
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to return tasks'
			});
		}
	},

	getTask: async (req: Request, res: Response) => {
		const { taskId } = req.params;
		const task = await Task.findById(taskId, null, { lean: true })
			.populate('createdBy', USER_FIELDS)
			.populate('assignedTo', USER_FIELDS)
			.populate(['project', 'sprint']);
		if (task) {
			res.status(200).json({
				task
			});
		} else {
			res.status(400).json({
				errorMessage: `Task #${taskId} does not exist`
			});
		}
	},

	createTask: async (req: Request, res: Response) => {
		const task = await Task.create(req.body);

		if (task) {
			if (req.body.project) {
				const project = await Project.findById(req.body.project);
				if (project && !project.tasks.some((t) => t._id.toString() === task._id.toString())) {
					await Project.findByIdAndUpdate(project._id, {
						project: [...project.tasks, task._id]
					});
				}
			}

			if (req.body.sprint) {
				const sprint = await Sprint.findById(req.body.sprint);
				if (sprint && !sprint.tasks.some((t) => t._id.toString() === task._id.toString())) {
					await Sprint.findByIdAndUpdate(sprint._id, {
						tasks: [...sprint.tasks, task._id]
					});
				}
			}

			res.status(201).json({
				task
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to create new task'
			});
		}
	},

	createSubtask: async (req: Request, res: Response) => {
		const { taskId } = req.params;
		const subtask = await Task.create(req.body);

		const task = await Task.findById(taskId);

		if (task) {
			const subtasks = [...task.subtasks, subtask._id];
			const updatedTask = await Task.findByIdAndUpdate(
				taskId,
				{ subtasks },
				{
					returnDocument: 'after',
					populate: {
						path: 'subtasks'
					}
				}
			);
			res.status(201).json({
				task: updatedTask
			});
		} else {
			res.status(400).json({
				errorMessage: `Task #${taskId} does not exist`
			});
		}
	},

	updateTask: async (req: Request, res: Response) => {
		const { taskId } = req.params;
		const existingTask = await Task.findById(taskId);

		if (existingTask) {
			/**
			 * Run the following operations if the assigned project has changed
			 */
			if (existingTask.project?.toString() !== req.body.project) {
				// Remove task from old project
				const oldProject = await Project.findById(existingTask.project);
				if (oldProject) {
					await Project.findByIdAndUpdate(oldProject._id, {
						tasks: oldProject.tasks.filter((t) => t._id.toString() !== existingTask._id.toString())
					});
				}

				// Add task to new project
				const newProject = await Project.findById(req.body.project);
				if (
					newProject &&
					!newProject.tasks.some((t) => t._id.toString() === existingTask._id.toString())
				) {
					await Project.findByIdAndUpdate(newProject._id, {
						tasks: [...newProject.tasks, existingTask._id]
					});
				}
			}

			/**
			 * Run the following operations if the assigned sprint has changed
			 */
			if (existingTask.sprint?.toString() !== req.body.sprint) {
				// Remove task from old sprint
				const oldSprint = await Sprint.findById(existingTask.sprint);
				if (oldSprint) {
					await Sprint.findByIdAndUpdate(oldSprint._id, {
						tasks: oldSprint.tasks.filter((t) => t._id.toString() !== existingTask._id.toString())
					});
				}

				// Add task to new sprint
				const newSprint = await Sprint.findById(req.body.sprint);
				if (
					newSprint &&
					!newSprint.tasks.some((t) => t._id.toString() === existingTask._id.toString())
				) {
					await Sprint.findByIdAndUpdate(newSprint._id, {
						tasks: [...newSprint.tasks, existingTask._id]
					});
				}
			}

			const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
				returnDocument: 'after',
				lean: true,
				populate: {
					path: 'createdBy',
					select: USER_FIELDS
				}
			});

			if (updatedTask) {
				res.status(200).json({ task: updatedTask });
			} else {
				res.status(500).json({
					errorMessage: 'Unable to update task'
				});
			}
		} else {
			res.status(400).json({
				errorMessage: `Task #${taskId} does not exist`
			});
		}
	},

	deleteTask: async (req: Request, res: Response) => {
		const { taskId } = req.params;
		try {
			await Task.findByIdAndDelete(taskId);
			res.status(204).json(null);
		} catch (e: unknown) {
			const error = e as Error;
			console.log(error);
			res.status(500).json({
				errorMessage: `Unable to delete task: ${error.message}`
			});
		}
	}
};

export default TaskController;
