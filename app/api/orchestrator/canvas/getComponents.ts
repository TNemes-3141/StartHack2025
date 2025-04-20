import { ContextData } from "./route";
import { components } from "./schemas/components";
import { formatContextData } from "./getInsights";
import OpenAI from "openai";

export async function getComponents(ai: OpenAI, context: ContextData, insights: string): Promise<string | undefined> {
    try {
        const query = generateComponentsLlmPrompt(context, insights);

        const completion = await ai.beta.chat.completions.parse({
            model: "gpt-4.1",
            messages: [
                { role: "user", content: query },
            ],
            response_format: components,
            temperature: 0.2,
        });

        if (completion.choices[0].finish_reason === "length") {
            throw new Error("Incomplete response");
        }

        const response = completion.choices[0].message.parsed;

        if (response) return JSON.stringify(response["cards"]);
        else return "";
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}

function generateComponentsLlmPrompt(context: ContextData, insights: string) {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.
        
        You should adhere to the provided specifications completely.

        Your job is to take labeled context data and a set of natural language insight instructions, and output an array of well-typed financial insight cards. These insight cards form a visual dashboard and can include charts, KPIs, tables, or news snippets.

        Each insight card you return must include:
        - type: The card type. One of "line" (for LineData), "candle" (for CandleData), "pie" (for PieData), "kpi" (for KpiData), "news" (for NewsData), or "table" (for TableData).
        - title: A descriptive title for the card.
        - data: The structured data matching the card type.

        Here is how the data should be structured:
        - For type "line": data is an array of points with { x: Date, y: number }.
        - For type "candle": data is an array of OHLC points with { x: Date, y: [open, high, low, close] }.
        - For type "pie": data is { label: string[], data: number[] } - the sum of data must be 100, and label[i] matches data[i].
        - For type "kpi": data is { number: number, footer: string }.
        - For type "news": data is { content: string, source: string }.
        - For type "table": data is { header: string[], content: { [key: string]: string } [] }.

        Use the titles and data exactly as instructed in the upstream insights. Do not modify the content or invent additional insights. You are only responsible for emitting the correctly typed JSON.

        Context data:
        ${formatContextData(context)}

        The upstream financial insights by label which you should adhere to:
        ${insights}

        You must return an object with a "cards" field, which is an array of insight card objects as described. Think first before you respond.
    `.trim();
}