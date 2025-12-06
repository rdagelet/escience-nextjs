import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Public (fetch single why feature)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const feature = await prisma.whyFeature.findUnique({
            where: { id },
        });

        if (!feature) {
            return NextResponse.json(
                { error: 'Why feature not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(feature);
    } catch (error) {
        console.error('Error fetching why feature:', error);
        return NextResponse.json(
            { error: 'Failed to fetch why feature' },
            { status: 500 }
        );
    }
}

// PUT - Protected (update why feature)
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
        const { title, description, order, active } = await request.json();

        const feature = await prisma.whyFeature.update({
            where: { id },
            data: {
                title,
                description,
                order,
                active,
            },
        });

        return NextResponse.json(feature);
    } catch (error) {
        console.error('Error updating why feature:', error);
        return NextResponse.json(
            { error: 'Failed to update why feature' },
            { status: 500 }
        );
    }
}

// DELETE - Protected (delete why feature)
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
        await prisma.whyFeature.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting why feature:', error);
        return NextResponse.json(
            { error: 'Failed to delete why feature' },
            { status: 500 }
        );
    }
}
