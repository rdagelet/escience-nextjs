import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const chunks = await prisma.knowledgeChunk.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(chunks);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch knowledge' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await request.json();
        await prisma.knowledgeChunk.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete chunk' },
            { status: 500 }
        );
    }
}
