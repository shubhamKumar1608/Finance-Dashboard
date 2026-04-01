import { Router } from 'express';
import { authenticateRequest } from '../middlewares/auth';
import { getSummary, getCategoryTotals, getRecent, getTrends } from '../controllers/dashboard';

const router = Router();

// Dashboard is accessible to all authenticated users (ADMIN, ANALYST, VIEWER)
router.use(authenticateRequest);

router.get('/summary', getSummary);
router.get('/category-totals', getCategoryTotals);
router.get('/recent', getRecent);
router.get('/trends', getTrends);

export default router;
