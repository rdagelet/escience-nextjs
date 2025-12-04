import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const job = await prisma.jobOpening.findUnique({
            where: { id },
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { title, department, location, type, description, requirements, isActive } = body;

        const job = await prisma.jobOpening.update({
            where: { id },
            data: {
                title,
                department,
                location,
                type,
                description,
                requirements,
                isActive,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.jobOpening.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Job deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
