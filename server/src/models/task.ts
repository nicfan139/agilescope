import { Schema, model } from 'mongoose';
import { TUser, userSchema } from './user';

export type TTask = {
	_id: string;
	title: string;
	description: string;
	complexity: 'easy' | 'medium' | 'hard';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	status: 'ready' | 'in-progress' | 'review' | 'completed';
	createdBy: TUser;
	assignee: TUser;
	completedAt: string;
	subtasks: Array<TTask> | null;
	dueDate?: string;
};

export const taskSchema = new Schema<TTask>(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: false
		},
		complexity: {
			type: String,
			required: true,
			enum: {
				values: ['easy', 'medium', 'hard'],
				message: '{VALUE} is not a valid complexity value'
			}
		},
		priority: {
			type: String,
			required: true,
			enum: {
				values: ['low', 'medium', 'high', 'urgent'],
				message: '{VALUE} is not a valid priority value'
			}
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ['ready', 'in-progress', 'review', 'completed'],
				message: '{VALUE} is not a valid status value'
			}
		},
		createdBy: userSchema,
		assignee: userSchema,
		completedAt: {
			type: String,
			required: false
		},
		dueDate: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

taskSchema.add({
	subtasks: [taskSchema]
});

export const Task = model('Task', taskSchema);
