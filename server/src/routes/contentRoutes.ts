import { Router } from 'express';
import { createModule, updateModule, deleteModule } from '../controllers/moduleController';
import { createLesson, updateLesson, deleteLesson } from '../controllers/lessonController';
import { authenticateCallback } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateCallback);

// Modules
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);

// Lessons
router.post('/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

export default router;
