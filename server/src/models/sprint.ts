import { Schema, model } from 'mongoose';
import { TTask, taskSchema } from './task';

export type TSprint = {
	_id: string;
	name: string;
	tasks: Array<TTask>;
	startDate: string;
	endDate: string;
};

export const sprintSchema = new Schema<TSprint>({
	name: {
		type: String,
		required: true
	},
	tasks: [taskSchema],
	startDate: {
		type: String,
		required: false
	},
	endDate: {
		type: String,
		required: false
	}
});

export const Sprint = model('Sprint', sprintSchema);
