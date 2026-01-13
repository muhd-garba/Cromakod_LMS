import { Router } from 'express';
import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/courseController';
import { authenticateCallback } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.use(authenticateCallback);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
