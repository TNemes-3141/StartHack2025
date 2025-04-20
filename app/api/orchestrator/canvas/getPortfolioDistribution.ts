import OpenAI from "openai";
import { portfolioDistribution } from "./schemas/portfolioDistribution";

export async function getPortfolioDistribution(ai: OpenAI, portfolio: any): Promise<string | undefined> {
    try {
        const query = generatePortfolioDistributionLlmPrompt(portfolio);

        const completion = await ai.beta.chat.completions.parse({
            model: "gpt-4.1-mini",
            messages: [
                { role: "user", content: query },
            ],
            response_format: portfolioDistribution
        });

        if (completion.choices[0].finish_reason === "length") {
            throw new Error("Incomplete response");
        }

        const response = completion.choices[0].message.parsed;

        return JSON.stringify(response);
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}

function generatePortfolioDistributionLlmPrompt(portfolio: any): string {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely.

        In this stage, you will analyze the provided portfolio of the client and determine how their assets are distributed across different domains. You return a JSON-formatted response where the domain names (e.g. natural resources, real estate, technology, ...) are the keys and the values are how many percent of the portfolio they inhibit. The percentages should ALWAYS add up to 100 percent.

        This is the portfolio you should analyze: ${JSON.stringify(portfolio)}

        How are their assets distributed? Think first before you respond.
    `.trim();
}