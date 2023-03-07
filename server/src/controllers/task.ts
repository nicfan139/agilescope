import { Request, Response } from 'express';
import { Task } from '../models';

const TaskController = {
	getTasks: async (_req: Request, res: Response) => {
		const tasks = await Task.find();
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
		const task = await Task.findById(taskId);
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
			if (task.subtasks) {
				task.subtasks.push(subtask);
				task.save();
				res.status(201).json({
					task
				});
			} else {
				const subtasks = [task];
				const updatedTask = await Task.findByIdAndUpdate(
					taskId,
					{ subtasks },
					{ returnDocument: 'after' }
				);
				res.status(201).json({
					task: updatedTask
				});
			}
		} else {
			res.status(400).json({
				errorMessage: `Task #${taskId} does not exist`
			});
		}
	},

	updateTask: async (req: Request, res: Response) => {
		const { taskId } = req.params;
		const task = await Task.findByIdAndUpdate(taskId, req.body, { returnDocument: 'after' });
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
