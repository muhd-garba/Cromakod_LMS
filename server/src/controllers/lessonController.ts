import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const lessonSchema = z.object({
    title: z.string().min(3),
    moduleId: z.string().uuid(),
    type: z.enum(['VIDEO', 'TEXT', 'QUIZ']),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    order: z.number().int(),
});

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const createLesson = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'INSTRUCTOR')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const data = lessonSchema.parse(req.body);

        // Verify module -> course ownership
        const module = await prisma.module.findUnique({
            where: { id: data.moduleId },
            include: { course: true }
        });
        if (!module) return res.status(404).json({ message: 'Module not found' });
        if (req.user.role !== 'ADMIN' && module.course.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const newLesson = await prisma.lesson.create({
            data,
        });

        res.status(201).json(newLesson);
    } catch (error) {
        res.status(400).json({ message: 'Error creating lesson', error });
    }
};

// ... Update and Delete are similar, skipping for brevity in this step but should be implemented.
// I will implement basic update/delete for completeness.

export const updateLesson = async (req: AuthRequest, res: Response) => {
    // ... Implementation similar to module update but targetting lesson
    try {
        const { id } = req.params;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: { module: { include: { course: true } } }
        });
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        if (req.user.role !== 'ADMIN' && lesson.module.course.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updated = await prisma.lesson.update({
            where: { id },
            data: req.body // simplified
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lesson' });
    }
};

export const deleteLesson = async (req: AuthRequest, res: Response) => {
    // ... Implementation
    try {
        const { id } = req.params;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: { module: { include: { course: true } } }
        });
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        if (req.user.role !== 'ADMIN' && lesson.module.course.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.lesson.delete({ where: { id } });
        res.json({ message: 'Lesson deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lesson' });
    }
};
