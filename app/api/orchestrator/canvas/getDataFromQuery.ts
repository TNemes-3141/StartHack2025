import OpenAI from "openai";
import { tools } from "./tools";
import { FunctionCall } from "./route";


export async function getDataFromQuery(ai: OpenAI, portfolio: any | undefined, history: any | undefined, insights: any[] | undefined, userQuery: string): Promise<FunctionCall[] | undefined> {
    try {
        const query = insights ? generateToolsLlmPromptWithInsights(portfolio, history, insights, userQuery) : generateToolsLlmPrompt(portfolio, history, userQuery);
        console.log("System prompt: " + query);

        const completion = await ai.chat.completions.create({
            model: "gpt-4.1",
            messages: [{ role: "user", content: query }],
            store: true,
            tool_choice: "required",
            tools
        });
        
        const toolCalls = completion.choices[0].message.tool_calls;

        if (!toolCalls) {
            return [];
        }

        const extractedToolCalls = toolCalls.map((call, index) => ({
            id: index + 1,
            name: call.function.name,
            arguments: JSON.parse(call.function.arguments),
        }));

        return extractedToolCalls;
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}

function generateToolsLlmPrompt(portfolio: any | undefined, history: any | undefined, userQuery: string): string {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely.

        In this stage, you will make queries to your tools to gather relevant information. Output the queries that should be made to these tools in their respectively correct formats. The results of the queries should be directly relevant to solve the user's question.

        ${portfolio ? `If the user refers to a portfolio, then this is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : ""}

        ${history ? `Here is the conversation history that you should take into account: ${JSON.stringify(history)}` : ""}

        Here is the user's question: ${userQuery}

        Today's date is ${today()}. What information would you retrieve from your tools to help the user solve his case? Think of companies whose data could be relevant. Think first before you respond.
    `.trim();
}

function generateToolsLlmPromptWithInsights(portfolio: any | undefined, history: any | undefined, insights: any, userQuery: string): string {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely.

        In this stage, you will make queries to your tools to gather relevant information. Output the queries that should be made to these tools in their respectively correct formats. The results of the queries should be directly relevant to solve the user's question.

        ${portfolio ? `If the user refers to a portfolio, then this is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : ""}

        ${history ? `Here is the conversation history that you should take into account: ${JSON.stringify(history)}` : ""}

        Here is data from insights (tables, charts, news articles) already generated that played a role earlier in the conversation; the user has selected them actively because he thinks they are relevant to their query, so you should pay attention to them: ${JSON.stringify(insights)}

        Here is the user's question: ${userQuery}

        Today's date is ${today()}. What information would you retrieve from your tools to help the user solve his case or explain the correlations he is interested in? Make function calls where necessary. Think first before you respond.
    `.trim();
}

function today(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    return formattedDate
}