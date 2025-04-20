import OpenAI from "openai";

export async function getReasoning(ai: OpenAI, portfolio: any | undefined, history: any, focusPoint: any, parentChart: any, userQuery: string): Promise<string | undefined> {
    try {
        const query = generateLlmPrompt(portfolio, history, focusPoint, parentChart, userQuery);

        const response = await ai.responses.create({
            model: "gpt-4.1",
            input: query
        });

        return response.output_text;
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}

function generateLlmPrompt(portfolio: any | undefined, history: any, focusPoint: string, parentChart: any, userQuery: string): string {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely. Use a friendly and conversational tone and address the user directly (say "you" instead of "the user").

        Currently, the user is focusing on a data collection and is interested in a particular cell of it. You should take the table and the cell he is focusing on as well as the user's query and the context (their portfolio, history of conversation with the AI system) into account to answer his query accordingly. 

        Data the user is focusing: ${JSON.stringify(parentChart)}
        The user is asking a question about the following value in the table: ${focusPoint}

        ${portfolio ? `When the user refers to it, take his portfolio into account: ${JSON.stringify(portfolio)}` : ""}
        Here is the conversation history that could provide meaningful context: ${JSON.stringify(history)}

        Evaluate the intention of the user and answer his query using the data provided or your background knowledge, but with no hallucinations. Do NOT use any Markdown formatting in your answer. Think first before you respond.
    `.trim();
}