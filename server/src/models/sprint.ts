import { Schema, Types, model } from 'mongoose';
import { TTask, taskSchema } from './task';

export type TSprint = {
	_id: Types.ObjectId;
	name: string;
	tasks: Array<TTask>;
	startDate: string;
	endDate: string;
};

export const sprintSchema = new Schema<TSprint>({
	_id: Types.ObjectId,
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
