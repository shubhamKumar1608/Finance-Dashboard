import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';

// Import routers (these will be created next)
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import recordRoutes from './routes/records';
import dashboardRoutes from './routes/dashboard';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Main API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Healthcheck
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Global error handler
app.use(errorHandler);

export default app;
