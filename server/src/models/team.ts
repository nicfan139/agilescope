import { Schema, model } from 'mongoose';
import { TUser } from './user';
import { TProject } from './project';

export type TTeam = {
	_id: string;
	name: string;
	description: string | null;
	members: Array<TUser>;
	projects: Array<TProject>;
};

export const teamSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		description: {
			type: String,
			required: false,
			default: null
		},
		members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
	},
	{
		timestamps: true
	}
);

export const Team = model('Team', teamSchema);
