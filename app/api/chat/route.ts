import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        // System prompt to define the bot's persona and knowledge
        const systemPrompt = `You are the AI Assistant for Electronic Science (eScience), a leading software solutions provider in the Philippines established in 2000.
    
    Your goal is to help visitors understand our services and products.
    
    Key Information:
    - We specialize in mobile solutions, CRM tools, inventory management, and custom software.
    - Our flagship products include:
      - PocketWiSE (Sales Force Automation)
      - 1-Order (Ordering System)
      - 1-Inventory (Inventory Management)
      - 1-Service (Field Service Management)
    - We have over 20 years of experience and serve top companies in the Philippines.
    - Contact email: info@electronicscience.net
    
    Tone: Professional, helpful, and innovative.
    Keep responses concise (under 3 sentences if possible) unless asked for details.`;

        // Construct messages array with history
        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []).map((msg: any) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
            })),
            { role: 'user', content: message },
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Cost-effective and fast
            messages: messages as any,
            max_tokens: 150,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        // Save to database
        try {
            await prisma.chatLog.create({
                data: {
                    userMessage: message,
                    botResponse: reply || 'No response',
                },
            });
        } catch (dbError) {
            console.error('Failed to save chat log:', dbError);
            // Continue even if logging fails
        }

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}
