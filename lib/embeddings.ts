import { OpenAIEmbeddings } from '@langchain/openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lazy initialization to avoid build-time errors
let embeddings: OpenAIEmbeddings | null = null;

function getEmbeddings(): OpenAIEmbeddings {
    if (!embeddings) {
        embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-ada-002', // 1536 dimensions
        });
    }
    return embeddings;
}

/**
 * Generate embedding vector for text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const embedding = await getEmbeddings().embedQuery(text);
    return embedding;
}

/**
 * Split text into smaller chunks for embedding
 */
export function chunkText(text: string, maxChunkSize: number = 500): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkSize) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Search for similar knowledge chunks
 */
export async function searchSimilarChunks(
    query: string,
    limit: number = 3
): Promise<Array<{ content: string; metadata: any; similarity: number }>> {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Get all chunks from database
    const chunks = await prisma.knowledgeChunk.findMany({
        where: {
            embedding: { not: null },
        },
    });

    // Calculate similarity scores
    const scoredChunks = chunks
        .map((chunk) => {
            const chunkEmbedding = JSON.parse(chunk.embedding || '[]');
            const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
            return {
                content: chunk.content,
                metadata: chunk.metadata,
                similarity,
            };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

    return scoredChunks;
}

/**
 * Add knowledge chunk to database
 */
export async function addKnowledgeChunk(
    content: string,
    metadata?: any
): Promise<void> {
    const embedding = await generateEmbedding(content);

    await prisma.knowledgeChunk.create({
        data: {
            content,
            embedding: JSON.stringify(embedding),
            metadata,
        },
    });
}
