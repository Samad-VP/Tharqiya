import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import allotmentRoutes from './routes/allotmentRoutes.js';
import principalRoutes from './routes/principalRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';
import campusRoutes from './routes/campusRoutes.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/allotments', allotmentRoutes);
app.use('/api/principal', principalRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/campus', campusRoutes);

// Basic Route
app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Tharqiya API is running' });
});

// Root route
app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Tharqiya College API');
});

// Error Handling
app.use(globalErrorHandler);

export default app;
