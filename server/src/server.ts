import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { expressjwt } from 'express-jwt';
import { connect } from 'mongoose';
import { createServer } from 'http';
import { authRoutes, taskRoutes, userRoutes } from './routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
const MONGODB_STRING = process.env.MONGODB_CONNECTION_STRING as string;

connect(MONGODB_STRING).then(
	() => {
		console.log('MongoDB connected!');
	},
	(err) => {
		console.log(`Error connecting to MongoDB: ${err}`);
	}
);

app.use(
	morgan('dev'),
	cors(),
	express.json(),
	expressjwt({
		algorithms: ['HS256'],
		credentialsRequired: false,
		secret: process.env.JWT_SECRET_KEY as string
	})
);

app.use('/api', authRoutes, taskRoutes, userRoutes);

const httpServer = createServer(app);

httpServer.listen({ port: PORT }, () => {
	console.log(`Server running on port ${PORT}`);
});
