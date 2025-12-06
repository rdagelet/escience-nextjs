import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Public (fetch single home stat)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const stat = await prisma.homeStat.findUnique({
            where: { id },
        });

        if (!stat) {
            return NextResponse.json(
                { error: 'Home stat not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(stat);
    } catch (error) {
        console.error('Error fetching home stat:', error);
        return NextResponse.json(
            { error: 'Failed to fetch home stat' },
            { status: 500 }
        );
    }
}

// PUT - Protected (update home stat)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { label, value, suffix, order, active } = await request.json();

        const stat = await prisma.homeStat.update({
            where: { id },
            data: {
                label,
                value,
                suffix: suffix || null,
                order,
                active,
            },
        });

        return NextResponse.json(stat);
    } catch (error) {
        console.error('Error updating home stat:', error);
        return NextResponse.json(
            { error: 'Failed to update home stat' },
            { status: 500 }
        );
    }
}

// DELETE - Protected (delete home stat)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.homeStat.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting home stat:', error);
        return NextResponse.json(
            { error: 'Failed to delete home stat' },
            { status: 500 }
        );
    }
}
