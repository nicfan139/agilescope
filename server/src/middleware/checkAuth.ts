import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import dotenv from 'dotenv';

dotenv.config();

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
	if (req.auth?.id) {
		res.locals.userId = req.auth.id;
		next();
	} else {
		res.status(401).json({
			errorMessage: 'Unauthorized'
		});
	}
};
