import { Schema, model } from 'mongoose';

export type TUser = {
	_id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	avatarUrl: string;
	otpEnabled: boolean;
	otpSecret?: string;
	verified: boolean;
	verifyEmailToken?: string;
};

export const userSchema = new Schema<TUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			match:
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		},
		password: {
			type: String,
			required: true,
			minlength: 8
		},
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		avatarUrl: {
			type: String,
			required: false,
			default: null
		},
		otpEnabled: {
			type: Boolean,
			required: true,
			default: false
		},
		otpSecret: {
			type: String,
			required: false,
			default: null
		},
		verified: {
			type: Boolean,
			required: true,
			default: false
		},
		verifyEmailToken: {
			type: String,
			required: false,
			default: null
		}
	},
	{ timestamps: true }
);

export const User = model('User', userSchema);
