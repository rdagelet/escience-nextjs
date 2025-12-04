import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const lowerMsg = message.toLowerCase();

        let reply = "I'm here to help! You can ask me about our products, careers, internships, or contact information.";

        // Simulated RAG (Retrieval Augmented Generation) Logic
        if (lowerMsg.includes('career') || lowerMsg.includes('job') || lowerMsg.includes('work') || lowerMsg.includes('hiring')) {
            reply = "We are always looking for talented individuals to join our team of 100+ tech specialists! We offer opportunities for Developers, QA Engineers, and Sales professionals. We also have an active Internship program. You can send your resume to careers@electronicscience.net.";
        }
        else if (lowerMsg.includes('intern') || lowerMsg.includes('ojt')) {
            reply = "Yes, we have a robust Internship/OJT program! Many of our current senior developers started as interns. It's a great way to learn real-world mobile development. Please email your CV to careers@electronicscience.net.";
        }
        else if (lowerMsg.includes('product') || lowerMsg.includes('solution') || lowerMsg.includes('offer')) {
            reply = "We specialize in mobile solutions including:\n\n1. PocketWiSE (Sales Force Automation)\n2. Swift-Forms (Paperless Operations)\n3. SwiftPoint/IMS (Inventory Management)\n4. Swift Rewards (Loyalty Systems)\n\nWhich one would you like to know more about?";
        }
        else if (lowerMsg.includes('pocketwise') || lowerMsg.includes('sfe')) {
            reply = "PocketWiSE is our flagship Sales Force Effectiveness (SFE) tool. It helps large field forces track attendance, inventory, and sales orders in real-time. It's used by major pharmaceutical and FMCG companies.";
        }
        else if (lowerMsg.includes('swift') || lowerMsg.includes('form')) {
            reply = "Swift-Forms allows you to digitize any paper form (leave requests, expense reports, surveys) into a mobile app. It eliminates waiting time and promotes contactless transactions.";
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone') || lowerMsg.includes('address')) {
            reply = "You can reach us at:\n\nEmail: sales@electronicscience.net\nPhone: 02-8850-1324\n\nWe are located in Manila, Philippines.";
        }
        else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            reply = "Hello! Welcome to eScience. How can I assist you today?";
        }
        else if (lowerMsg.includes('who are you') || lowerMsg.includes('bot')) {
            reply = "I am the eScience AI Assistant, powered by Next.js. I can answer questions about our company and services.";
        }

        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ reply });
    } catch (error) {
        return NextResponse.json({ reply: "I'm sorry, I encountered an error processing your request." }, { status: 500 });
    }
}
