import { Request, Response } from 'express';
import { Task } from '../models';
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
			.populate('project');
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
		const task = await Task.findByIdAndUpdate(taskId, req.body, {
			returnDocument: 'after',
			lean: true,
			populate: {
				path: 'createdBy',
				select: USER_FIELDS
			}
		});
		if (task) {
			res.status(200).json({ task });
		} else {
			res.status(500).json({
				errorMessage: 'Unable to update task'
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
