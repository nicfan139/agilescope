import { Schema, Types, model } from 'mongoose';
import { TUser, userSchema } from './user';
import { TProject, projectSchema } from './project';

export type TTeam = {
	name: string;
	description: string | null;
	members: Array<TUser>;
	projects: Array<TProject>;
};

export const teamSchema = new Schema(
	{
		_id: Types.ObjectId,
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
		members: [userSchema],
		projects: [projectSchema]
	},
	{
		timestamps: true
	}
);

export const Team = model('Team', teamSchema);
