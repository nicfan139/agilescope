import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { sendEmail } from '../utils';

dotenv.config();
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);
const USER_FIELDS = [
	'_id',
	'email',
	'firstName',
	'lastName',
	'avatarUrl',
	'otpEnabled',
	'verified'
];

const UserController = {
	getUsers: async (_req: Request, res: Response) => {
		const users = await User.find({}, USER_FIELDS);
		if (users) {
			res.status(200).json({
				users
			});
		} else {
			res.status(400).json({
				errorMessage: 'Unable to return teams'
			});
		}
	},

	getUser: async (req: Request, res: Response) => {
		const { userId } = req.params;
		const user = await User.findById(userId, USER_FIELDS, {
			lean: true
		});

		if (user) {
			res.status(200).json({
				user
			});
		} else {
			res.status(400).json({
				errorMessage: 'User does not exist'
			});
		}
	},

	createUser: async (req: Request, res: Response) => {
		const existingUser = await User.findOne({ email: req.body.email });

		if (existingUser) {
			res.status(400).json({
				errorMessage: 'User already exists'
			});
		}

		const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);
		const hashedEmailVerifyToken = await bcrypt.hash(req.body.email, BCRYPT_SALT_ROUNDS);

		if (hashedPassword && hashedEmailVerifyToken) {
			const payload = {
				...req.body,
				password: hashedPassword,
				emailVerifyToken: hashedEmailVerifyToken
			};
			const user = await User.create(payload);

			if (user) {
				await sendEmail({
					to: user.email,
					type: 'verifyEmail',
					payload: hashedEmailVerifyToken
				});

				res.status(201).json({
					user
				});
			} else {
				res.status(500).json({
					errorMessage: 'Unable to create user'
				});
			}
		} else {
			res.status(500).json({
				errorMessage: 'Unable to create user'
			});
		}
	},

	updateUser: async (req: Request, res: Response) => {
		const { userId } = req.params;
		const user = await User.findByIdAndUpdate(userId, req.body, {
			returnDocument: 'after',
			lean: true,
			projection: USER_FIELDS
		});
		if (user) {
			res.status(200).json({
				user
			});
		} else {
			res.status(500).json({
				errorMessage: 'Unable to update user'
			});
		}
	}
};

export default UserController;
