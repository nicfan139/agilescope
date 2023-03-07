import { Schema, Types, model } from 'mongoose';
import { TUser, userSchema } from './user';

type TTask = {
	_id: Types.ObjectId;
	title: string;
	description: string;
	complexity: 'easy' | 'medium' | 'hard';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	createdBy: TUser;
	assignee: TUser;
	completed: boolean;
	subtasks: Array<TTask> | null;
	dueDate?: string;
};

const taskSchema = new Schema<TTask>(
	{
		_id: Types.ObjectId,
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
		createdBy: userSchema,
		assignee: userSchema,
		completed: {
			type: Boolean,
			required: true,
			default: false
		},
		dueDate: {
			type: String,
			required: true,
			default: false
		}
	},
	{ timestamps: true }
);

taskSchema.add({
	subtasks: [taskSchema]
});

export const Task = model('Task', taskSchema);
