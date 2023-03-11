import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { User } from '../models';
import { sendEmail } from '../utils';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

const AuthController = {
	login: async (req: Request, res: Response) => {
		const user = await User.findOne({ email: req.body.email });

		if (user) {
			bcrypt.compare(req.body.password, user.password, async (err, result) => {
				if (err) {
					res.status(401).json({
						errorMessage: 'Invalid email/password combination'
					});
				}

				if (result) {
					if (user.otpEnabled) {
						const secret = speakeasy.generateSecret().base32;
						const otp = speakeasy.totp({
							secret,
							encoding: 'base32',
							step: 300
						});

						await User.findByIdAndUpdate(
							user.id,
							{ otpSecret: secret },
							{ returnDocument: 'after' }
						);

						await sendEmail({ to: user.email, type: 'otp', payload: otp });
					}

					const token = jwt.sign(
						{
							id: user._id
						},
						JWT_SECRET_KEY,
						{
							expiresIn: '24h'
						}
					);
					res.status(200).json({
						message: 'Authentication successful',
						token: token,
						otpEnabled: user.otpEnabled
					});
				} else {
					res.status(401).json({
						errorMessage: 'Invalid email/password combination'
					});
				}
			});
		} else {
			res.status(401).json({
				errorMessage: 'Authentication failed'
			});
		}
	},

	verifyEmail: async (req: Request, res: Response) => {
		const { verifyEmailToken } = req.body;

		const user = await User.findOne({ verifyEmailToken }).exec();

		if (user) {
			if (user.verified) {
				res.status(400).json({
					isVerified: true,
					errorMessage: 'User has already been verified'
				});
			} else {
				const updatedUser = await User.findOneAndUpdate(
					{ verifyEmailToken },
					{ verified: true, verifyEmailToken: null },
					{ returnDocument: 'after' }
				);

				res.status(201).json({
					isVerified: true,
					user: updatedUser
				});
			}
		} else {
			res.status(500).json({
				isVerified: false,
				errorMessage: 'Verify token invalid'
			});
		}
	},

	validateOtp: async (req: Request, res: Response) => {
		const { accessToken, otp } = req.body;

		let jwtPayload;
		try {
			jwtPayload = jwt.verify(accessToken, JWT_SECRET_KEY) as JwtPayload;
		} catch (error) {
			console.log(error);
			res.status(500).json({
				otpValid: false,
				errorMessage: 'Unable to verify access token'
			});
		}

		if (jwtPayload) {
			const user = await User.findOne({ _id: jwtPayload.id });
			if (user) {
				const tokenIsValid = speakeasy.totp.verify({
					secret: user.otpSecret as string,
					encoding: 'base32',
					token: otp,
					step: 300
				});

				if (tokenIsValid) {
					await User.findByIdAndUpdate(user.id, { otpSecret: null }, { returnDocument: 'after' });

					res.status(201).json({
						otpValid: true
					});
				} else {
					res.status(500).json({
						otpValid: false,
						errorMessage: 'Unable to validate one-time password'
					});
				}
			} else {
				res.status(500).json({
					otpValid: false,
					errorMessage: 'Unable to extract user details with the provided access token'
				});
			}
		} else {
			res.status(400).json({
				otpValid: false,
				errorMessage: 'Invalid or expired access token'
			});
		}
	},

	validateToken: async (_req: Request, res: Response) => {
		const user = await User.findOne({ _id: res.locals.userId });
		if (user) {
			res.status(200).json({
				isTokenValid: true,
				user: {
					_id: user._id,
					email: user.email
				}
			});
		} else {
			res.status(500).json({
				isTokenValid: false,
				errorMessage: 'Unable to extract user details with the provided access token'
			});
		}
	}
};

export default AuthController;
