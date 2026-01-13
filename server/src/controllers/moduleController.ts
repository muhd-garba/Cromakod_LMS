import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const moduleSchema = z.object({
    title: z.string().min(3),
    order: z.number().int(),
    courseId: z.string().uuid(),
});

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const createModule = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'INSTRUCTOR')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const data = moduleSchema.parse(req.body);

        // Verify course ownership
        const course = await prisma.course.findUnique({ where: { id: data.courseId } });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (req.user.role !== 'ADMIN' && course.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const newModule = await prisma.module.create({
            data,
        });

        res.status(201).json(newModule);
    } catch (error) {
        res.status(400).json({ message: 'Error creating module', error });
    }
};

export const updateModule = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'INSTRUCTOR')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { title, order } = req.body; // Simple update

        const existingModule = await prisma.module.findUnique({
            where: { id },
            include: { course: true }
        });
        if (!existingModule) return res.status(404).json({ message: 'Module not found' });

        if (req.user.role !== 'ADMIN' && existingModule.course.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updated = await prisma.module.update({
            where: { id },
            data: { title, order }
        });

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Error updating module', error });
    }
};

export const deleteModule = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'INSTRUCTOR')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const existingModule = await prisma.module.findUnique({
            where: { id },
            include: { course: true }
        });
        if (!existingModule) return res.status(404).json({ message: 'Module not found' });

        if (req.user.role !== 'ADMIN' && existingModule.course.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.module.delete({ where: { id } });
        res.json({ message: 'Module deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting module', error });
    }
};
