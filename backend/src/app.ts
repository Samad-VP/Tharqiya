import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './routes/authRoutes';
import admissionRoutes from './routes/admissionRoutes';
import interviewRoutes from './routes/interviewRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import resultRoutes from './routes/resultRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/results', resultRoutes);

// Basic Route
app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Tharqiya API is running' });
});

// Root route
app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Tharqiya College API');
});

export default app;
