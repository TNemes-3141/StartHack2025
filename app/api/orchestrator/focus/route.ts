import OpenAI from "openai";
import { getReasoning } from "./getReasoning";

export async function POST(request: Request) {
    try {
        // Parse request body
        const { query, portfolio, conversationHistory, focusPoint, parentChart } = await request.json();

        const apiKey = process.env.OPENAI_API_KEY!;
        const openai = new OpenAI({ apiKey: apiKey });

        if (!query || !focusPoint || !parentChart) {
            return new Response(JSON.stringify({ error: "Missing data" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Step 1: Send user query and portfolio to QUERY for data
                    await sendMessage(controller, encoder, "Focusing in...");
                    const answer = await getReasoning(openai, portfolio, conversationHistory, focusPoint, parentChart, query) ?? "";

                    await sendMessage(controller, encoder, answer.length > 0 ? `FINAL_RESPONSE:${answer}` : "FINAL_RESPONSE:I could not process your request, please try again later!", 500);
                    controller.close(); // Close the stream when finished
                } catch (error) {
                    controller.enqueue(encoder.encode(`Error: ${error}\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        console.error("Error in orchestrator:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

async function sendMessage(controller: ReadableStreamDefaultController<any>, encoder: TextEncoder, message: string, delay = 1000) {
    controller.enqueue(encoder.encode(`${message}\n`));
    await new Promise((resolve) => setTimeout(resolve, delay));
}