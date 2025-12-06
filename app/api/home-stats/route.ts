import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Public (fetch all active home stats)
export async function GET() {
    try {
        const stats = await prisma.homeStat.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching home stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch home stats' },
            { status: 500 }
        );
    }
}

// POST - Protected (create new home stat)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { label, value, suffix, order, active } = await request.json();

        if (!label || !value) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const stat = await prisma.homeStat.create({
            data: {
                label,
                value,
                suffix: suffix || null,
                order: order ?? 0,
                active: active ?? true,
            },
        });

        return NextResponse.json(stat);
    } catch (error) {
        console.error('Error creating home stat:', error);
        return NextResponse.json(
            { error: 'Failed to create home stat' },
            { status: 500 }
        );
    }
}
