import { Router } from 'express';
import { authenticateRequest, requireRoles } from '../middlewares/auth';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/users';

const router = Router();

router.use(authenticateRequest);
router.use(requireRoles(['ADMIN']));

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
