import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/db';

const listQuerySchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
});

export const listRecords = async (req: Request, res: Response) => {
    const query = listQuerySchema.parse(req.query);
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;
    if (query.startDate || query.endDate) {
        where.date = {};
        if (query.startDate) where.date.gte = new Date(query.startDate);
        if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    const [total, records] = await Promise.all([
        prisma.record.count({ where }),
        prisma.record.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } })
    ]);

    res.json({ total, page, limit, records });
};

const createRecordSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(1),
    date: z.string(), // ISO string parseable to Date
    notes: z.string().optional(),
});

export const createRecord = async (req: Request, res: Response) => {
    const data = createRecordSchema.parse(req.body);
    const createdBy = req.user!.userId;

    const record = await prisma.record.create({
        data: {
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: new Date(data.date),
            notes: data.notes,
            createdBy,
        }
    });

    res.status(201).json(record);
};

const updateRecordSchema = z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(1).optional(),
    date: z.string().optional(),
    notes: z.string().optional(),
});

export const updateRecord = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = updateRecordSchema.parse(req.body);

    const updateData: any = { ...data };
    if (data.date) updateData.date = new Date(data.date);

    const record = await prisma.record.update({
        where: { id },
        data: updateData,
    });

    res.json(record);
};

export const deleteRecord = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await prisma.record.delete({ where: { id } });
    res.json({ message: 'Record deleted' });
};
