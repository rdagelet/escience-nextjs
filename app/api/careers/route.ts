import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const jobs = await prisma.jobOpening.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, department, location, type, description, requirements, isActive } = body;

        const job = await prisma.jobOpening.create({
            data: {
                title,
                department,
                location,
                type,
                description,
                requirements,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}
