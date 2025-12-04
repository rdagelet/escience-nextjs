import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const chats = await prisma.chatLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit to last 100 chats
        });
        return NextResponse.json(chats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
    }
}
