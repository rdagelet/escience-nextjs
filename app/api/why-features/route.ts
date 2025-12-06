import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Public (fetch all active why features)
export async function GET() {
    try {
        const features = await prisma.whyFeature.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(features);
    } catch (error) {
        console.error('Error fetching why features:', error);
        return NextResponse.json(
            { error: 'Failed to fetch why features' },
            { status: 500 }
        );
    }
}

// POST - Protected (create new why feature)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, description, order, active } = await request.json();

        if (!title || !description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const feature = await prisma.whyFeature.create({
            data: {
                title,
                description,
                order: order ?? 0,
                active: active ?? true,
            },
        });

        return NextResponse.json(feature);
    } catch (error) {
        console.error('Error creating why feature:', error);
        return NextResponse.json(
            { error: 'Failed to create why feature' },
            { status: 500 }
        );
    }
}
