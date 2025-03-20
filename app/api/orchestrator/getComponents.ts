import { ContextData } from "./getInsights";
import OpenAI from "openai";

export async function getComponents(context: ContextData, insights: string, apiKey: string): Promise<string | undefined> {
    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });
        const thread = await openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: generateComponentsLlmPromptOpenAi(context, insights),
            }
        );

        let run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            {
                assistant_id: "asst_1qdCPMvyP8AlwG0cwJRGu1wv",
            }
        );

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                run.thread_id
            );
            const message = messages.data[0];
            if (message.content.length > 0 && message.content[0].type === "text") {
                const textContent = (message.content[0] as { type: "text"; text: { value: string } }).text.value;
                return textContent
            } else {
                console.warn("Message content is not text:", message.content);
            }
        } else {
            console.log(run.status);
        }
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}

function generateComponentsLlmPromptOpenAi(context: ContextData, insights: string) {
    return `
        Context data:
        ${formatContextData(context)}

        The financial insights by label:
        ${insights}

        Translate this to a JSON string that can be parsed correctly. Think first before you respond.
    `.trim();
}

export const formatContextData = (data: ContextData): string => {
    // Format SIX data
    const sixDataFormatted = data.sixData.map((entry, index) => `[SIX_Data ${index + 1}] ${entry}`).join("\n");

    // Format Portfolio Distribution
    const portfolioFormatted = data.portfolioDistribution ? `[Portfolio_Dist] ${data.portfolioDistribution}` : "";

    // Format News
    const newsFormatted = data.news.map((entry, index) => `[News ${index + 1}] ${entry}`).join("\n");

    // Combine all sections, removing any empty ones
    return [sixDataFormatted, portfolioFormatted, newsFormatted].filter(Boolean).join("\n\n");
};

const extractResponseText = (input: string): string[] => {
    const regex = /<response>([\s\S]*?)<\/response>/g;
    const matches = Array.from(input.matchAll(regex)); // Convert to array

    return matches.map(match => match[1]); // Extract text inside the tags
};