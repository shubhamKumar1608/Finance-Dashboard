import { Router } from 'express';
import { authenticateRequest, requireRoles } from '../middlewares/auth';
import { listRecords, createRecord, updateRecord, deleteRecord } from '../controllers/records';

const router = Router();

router.use(authenticateRequest);

// List allows ANALYST and ADMIN
router.get('/', requireRoles(['ADMIN', 'ANALYST']), listRecords);

// Manage allows ADMIN only
router.post('/', requireRoles(['ADMIN']), createRecord);
router.put('/:id', requireRoles(['ADMIN']), updateRecord);
router.delete('/:id', requireRoles(['ADMIN']), deleteRecord);

export default router;
