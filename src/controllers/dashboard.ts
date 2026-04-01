import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getSummary = async (req: Request, res: Response) => {
    const records = await prisma.record.findMany({
        select: { amount: true, type: true }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach(r => {
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
    // Group by category
    const grouped = await prisma.record.groupBy({
        by: ['category', 'type'],
        _sum: {
            amount: true
        }
    });

    const formatted = grouped.map(g => ({
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
    // Simplify trends by grouping by month/year in memory for SQLite compatibility.
    // In a robust SQL DB context, we would use native GROUP BY date functions, but SQLite 
    // mapping in Prisma makes grouping by arbitrary date intervals tricky natively.

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
