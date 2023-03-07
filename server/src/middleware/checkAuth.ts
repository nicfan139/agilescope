import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
	try {
		const jwtPayload = jwt.verify(req.auth?.id, process.env.JWT_SECRET_KEY as string) as JwtPayload;
		res.locals.userId = jwtPayload.id;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			errorMessage: 'Unauthorized'
		});
	}
};
