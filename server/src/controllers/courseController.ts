import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for Course Creation/Update
const courseSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    thumbnail: z.string().optional(),
    price: z.number().min(0).optional(),
    category: z.string(),
    isPublished: z.boolean().optional(),
});

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const createCourse = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'INSTRUCTOR')) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const data = courseSchema.parse(req.body);
        const course = await prisma.course.create({
            data: {
                ...data,
                instructorId: req.user.userId,
            },
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: 'Error creating course', error });
    }
};

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            where: { isPublished: true },
            include: { instructor: { select: { name: true } } },
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                instructor: { select: { name: true } },
                modules: {
                    include: { lessons: true }
                }
            },
        });

        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error });
    }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const existingCourse = await prisma.course.findUnique({ where: { id } });
        if (!existingCourse) return res.status(404).json({ message: 'Course not found' });

        if (req.user.role !== 'ADMIN' && existingCourse.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const data = courseSchema.partial().parse(req.body);
        const updatedCourse = await prisma.course.update({
            where: { id },
            data,
        });

        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: 'Error updating course', error });
    }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const existingCourse = await prisma.course.findUnique({ where: { id } });
        if (!existingCourse) return res.status(404).json({ message: 'Course not found' });

        if (req.user.role !== 'ADMIN' && existingCourse.instructorId !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await prisma.course.delete({ where: { id } });
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error });
    }
};
