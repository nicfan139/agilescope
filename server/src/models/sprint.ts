import { Schema, model } from 'mongoose';
import { TTask } from './task';

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
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
	startDate: {
		type: String,
		required: true
	},
	endDate: {
		type: String,
		required: true
	}
});

export const Sprint = model('Sprint', sprintSchema);
