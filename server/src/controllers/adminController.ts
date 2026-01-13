import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response) => {
    try {
        const [usersCount, coursesCount, enrollmentsCount] = await Promise.all([
            prisma.user.count(),
            prisma.course.count(),
            prisma.enrollment.count(),
        ]);

        res.json({
            usersCount,
            coursesCount,
            enrollmentsCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};
