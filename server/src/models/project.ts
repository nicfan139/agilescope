import { Schema, model } from 'mongoose';
import { TTask, taskSchema } from './task';
import { TUser, userSchema } from './user';

export type TProject = {
	_id: string;
	title: string;
	description: string;
	complexity: 'easy' | 'medium' | 'hard';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	status: 'ready' | 'in-progress' | 'review' | 'completed';
	createdBy: TUser;
	members: Array<TUser>;
	tasks: Array<TTask>;
	startedAt?: string;
	completedAt?: string;
	dueDate?: string;
};

export const projectSchema = new Schema<TProject>(
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
		members: [userSchema],
		tasks: [taskSchema],
		startedAt: {
			type: String,
			required: false
		},
		completedAt: {
			type: String,
			required: false
		},
		dueDate: {
			type: String,
			required: false
		}
	},
	{ timestamps: true }
);

export const Project = model('Project', projectSchema);
