import express from 'express';
import path from 'path';
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

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get(/(.*)/, (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global error handler
app.use(errorHandler);

export default app;
