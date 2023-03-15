import { Schema, model } from 'mongoose';
import { TProject } from './project';
import { TSprint } from './sprint';
import { TUser } from './user';

export type TTask = {
	_id: string;
	title: string;
	description: string;
	complexity: 'easy' | 'medium' | 'hard';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	status: 'ready' | 'in-progress' | 'review' | 'completed';
	createdBy: TUser;
	assignedTo: TUser;
	project: TProject;
	sprint: TSprint;
	completedAt?: string;
	subtasks: Array<TUser>;
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
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		assignedTo: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: false,
			default: null
		},
		sprint: {
			type: Schema.Types.ObjectId,
			ref: 'Sprint',
			required: false,
			default: null
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

taskSchema.add({
	subtasks: [{ type: Schema.Types.ObjectId, ref: 'Task', required: false }]
});

export const Task = model('Task', taskSchema);
