import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    bio: z.string().optional(),
    phone: z.string().optional(),
});

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, email: true, name: true, role: true, bio: true, phone: true, createdAt: true },
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const data = updateProfileSchema.parse(req.body);

        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data,
            select: { id: true, email: true, name: true, role: true, bio: true, phone: true },
        });

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Validation error or server error', error });
    }
};
