import { Schema, model } from 'mongoose';
import { TUser } from './user';

export type TTeam = {
	_id: string;
	name: string;
	description: string | null;
	members: Array<TUser>;
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
		members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
	},
	{
		timestamps: true
	}
);

export const Team = model('Team', teamSchema);
