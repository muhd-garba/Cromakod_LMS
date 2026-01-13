import { Router } from 'express';
import { enrollCourse, getMyEnrollments, updateProgress } from '../controllers/enrollmentController';
import { authenticateCallback } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateCallback);

router.post('/', enrollCourse);
router.get('/my', getMyEnrollments);
router.put('/progress', updateProgress);

export default router;
