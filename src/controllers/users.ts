import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/db';
import bcrypt from 'bcrypt';

export const listUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
    });
    res.json(users);
};

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']),
});

export const createUser = async (req: Request, res: Response) => {
    const data = createUserSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: { email: data.email, passwordHash, name: data.name, role: data.role },
        select: { id: true, email: true, name: true, role: true, status: true }
    });
    res.status(201).json(user);
};

const updateUserSchema = z.object({
    role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = updateUserSchema.parse(req.body);

    const user = await prisma.user.update({
        where: { id },
        data,
        select: { id: true, email: true, name: true, role: true, status: true }
    });
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    // Soft delete typically just updates status
    const user = await prisma.user.update({
        where: { id },
        data: { status: 'INACTIVE' },
        select: { id: true, email: true, status: true }
    });
    res.json({ message: 'User soft deleted (deactivated)', user });
};
