import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticateCallback } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateCallback);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
