import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import contentRoutes from './contentRoutes';
import uploadRoutes from './uploadRoutes';
import enrollmentRoutes from './enrollmentRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/content', contentRoutes);
router.use('/upload', uploadRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/admin', adminRoutes);

export default router;
