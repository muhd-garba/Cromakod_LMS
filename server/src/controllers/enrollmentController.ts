import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const enrollCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.userId,
                    courseId,
                },
            },
        });

        if (existing) return res.status(400).json({ message: 'Already enrolled' });

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: req.user.userId,
                courseId,
            },
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Enrollment failed', error });
    }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const enrollments = await prisma.enrollment.findMany({
            where: { userId: req.user.userId },
            include: { course: true },
        });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrollments', error });
    }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId, lessonId } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: req.user.userId,
                    courseId,
                },
            },
        });

        if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

        // Add lessonId to completedLessons if not present
        const completedLessons = enrollment.completedLessons || [];
        if (!completedLessons.includes(lessonId)) {
            // Logic to calculate progress percentage could be added here
            // For now, just add the lesson
            await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: {
                    completedLessons: { push: lessonId }
                }
            });
        }

        res.json({ message: 'Progress updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error });
    }
};
