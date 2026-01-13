import { Router } from 'express';
import { getStats, getAllUsers, updateUserRole } from '../controllers/adminController';
import { authenticateCallback, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateCallback);
router.use(authorize(['ADMIN']));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
