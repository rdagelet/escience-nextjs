import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { chunkText, addKnowledgeChunk } from '@/lib/embeddings';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { content, source } = await request.json();

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        // Split content into chunks
        const chunks = chunkText(content, 500);

        // Store each chunk with embeddings
        const promises = chunks.map((chunk, index) =>
            addKnowledgeChunk(chunk, {
                source: source || 'manual_upload',
                chunkIndex: index,
                timestamp: new Date().toISOString(),
            })
        );

        await Promise.all(promises);

        return NextResponse.json({
            success: true,
            chunksCreated: chunks.length,
        });
    } catch (error) {
        console.error('Failed to process knowledge:', error);
        return NextResponse.json(
            { error: 'Failed to process knowledge' },
            { status: 500 }
        );
    }
}
