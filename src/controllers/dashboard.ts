import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getSummary = async (req: Request, res: Response) => {
    const records = await prisma.record.findMany({
        select: { amount: true, type: true }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((r: any) => {
        if (r.type === 'INCOME') totalIncome += r.amount;
        else if (r.type === 'EXPENSE') totalExpense += r.amount;
    });

    res.json({
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
    });
};

export const getCategoryTotals = async (req: Request, res: Response) => {
    const grouped = await prisma.record.groupBy({
        by: ['category', 'type'],
        _sum: {
            amount: true
        }
    });

    const formatted = grouped.map((g: any) => ({
        category: g.category,
        type: g.type,
        total: g._sum.amount || 0
    }));

    res.json(formatted);
};

export const getRecent = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string || '5');
    const recent = await prisma.record.findMany({
        take: limit,
        orderBy: { date: 'desc' }
    });

    res.json(recent);
};

export const getTrends = async (req: Request, res: Response) => {
    const records = await prisma.record.findMany({
        select: { amount: true, type: true, date: true },
        orderBy: { date: 'asc' }
    });

    const trends: Record<string, { income: number, expense: number }> = {};

    records.forEach(r => {
        const monthYear = `${r.date.getFullYear()}-${(r.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!trends[monthYear]) {
            trends[monthYear] = { income: 0, expense: 0 };
        }

        if (r.type === 'INCOME') trends[monthYear].income += r.amount;
        else if (r.type === 'EXPENSE') trends[monthYear].expense += r.amount;
    });

    res.json(trends);
};

export const getFullSummary = async (req: Request, res: Response) => {
    const records = await prisma.record.findMany({
        orderBy: { date: 'desc' }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<string, number> = {};
    const trendsMap: Record<string, { income: number, expense: number }> = {};
    const recent = records.slice(0, 5);

    records.forEach(r => {
        if (r.type === 'INCOME') totalIncome += r.amount;
        else if (r.type === 'EXPENSE') totalExpense += r.amount;

        const catKey = `${r.type}:${r.category}`;
        categoryMap[catKey] = (categoryMap[catKey] || 0) + r.amount;

        const monthYear = `${r.date.getFullYear()}-${(r.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!trendsMap[monthYear]) {
            trendsMap[monthYear] = { income: 0, expense: 0 };
        }
        if (r.type === 'INCOME') trendsMap[monthYear].income += r.amount;
        else if (r.type === 'EXPENSE') trendsMap[monthYear].expense += r.amount;
    });

    res.json({
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        categories: Object.entries(categoryMap).map(([key, amount]) => {
            const [type, category] = key.split(':');
            return { type, category, amount };
        }),
        trends: Object.entries(trendsMap).map(([month, data]) => ({ month, ...data })),
        recent
    });
};
