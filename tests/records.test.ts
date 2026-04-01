import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/db';
import { generateToken } from '../src/utils/jwt';

let adminToken: string;
let viewerToken: string;
let adminUserId: string;

beforeAll(async () => {
    await prisma.record.deleteMany({});
    await prisma.user.deleteMany({});

    const adminUser = await prisma.user.create({
        data: { email: 'admin2@test.com', passwordHash: 'hash', name: 'Admin', role: 'ADMIN' }
    });
    adminUserId = adminUser.id;
    adminToken = generateToken({ userId: adminUserId, role: 'ADMIN' });

    const viewerUser = await prisma.user.create({
        data: { email: 'viewer2@test.com', passwordHash: 'hash', name: 'Viewer', role: 'VIEWER' }
    });
    viewerToken = generateToken({ userId: viewerUser.id, role: 'VIEWER' });
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Record Endpoints Access Control', () => {
    it('Admin should be able to create a record', async () => {
        const res = await request(app)
            .post('/api/v1/records')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                amount: 100,
                type: 'INCOME',
                category: 'Salary',
                date: new Date().toISOString(),
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('amount', 100);
    });

    it('Viewer should be rejected from creating a record', async () => {
        const res = await request(app)
            .post('/api/v1/records')
            .set('Authorization', `Bearer ${viewerToken}`)
            .send({
                amount: 50,
                type: 'EXPENSE',
                category: 'Food',
                date: new Date().toISOString(),
            });
        expect(res.statusCode).toEqual(403);
    });
});
