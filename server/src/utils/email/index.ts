import { createTransport, TransportOptions } from 'nodemailer';
import { getOtpEmailHtml } from './otpEmail';
import { getVerifyEmailHtml } from './verifyEmail';

interface ISendEmailProps {
	to: string;
	type: 'verifyEmail' | 'otp';
	payload: string;
}

export const sendEmail = async ({ to, type, payload }: ISendEmailProps) => {
	const transport = createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USERNAME,
			pass: process.env.SMTP_PASSWORD
		}
	} as TransportOptions);

	return await transport.sendMail({
		from: 'admin@agilescope.com',
		to,
		...(type === 'otp' && {
			subject: 'Your one-time password for AgileScope',
			html: getOtpEmailHtml(payload)
		}),
		...(type === 'verifyEmail' && {
			subject: 'Verify your email for AgileScope',
			html: getVerifyEmailHtml(payload)
		})
	});
};
