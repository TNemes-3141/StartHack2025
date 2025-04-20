import { ContextData } from "./route";
import { insightsResponse } from "./schemas/insightsResponse";
import OpenAI from "openai";

type Insights = {
    insights: string,
    message: string,
}

export async function getInsights(ai: OpenAI, context: ContextData, portfolio: any | undefined, insightsData: any[] | undefined, userQuery: string): Promise<Insights | undefined> {
    try {
        const query = insightsData ?
            generateInsightsLlmPromptWithInsights(context, portfolio, insightsData, userQuery) :
            generateInsightsLlmPrompt(context, portfolio, userQuery);

        const completion = await ai.beta.chat.completions.parse({
            model: "gpt-4.1",
            messages: [
                { role: "user", content: query },
            ],
            response_format: insightsResponse
        });

        if (completion.choices[0].finish_reason === "length") {
            throw new Error("Incomplete response");
        }

        const response = completion.choices[0].message.parsed;

        if (response) {
            return {
                insights: JSON.stringify(response["insights"]),
                message: stripQuotes(JSON.stringify(response["message"]))
            };
        }
        else {
            return {
                insights: "",
                message: ""
            };
        }
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}

function generateInsightsLlmPrompt(context: ContextData, portfolio: any | undefined, userQuery: string) {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely.

        In this stage, you decide which insights to generate for the user's dashboard based on the context data (from market APIs and other sources), the query they provided and if applicable, their portfolio. The information you're about to receive has been carefully curated and you have to decide which ones matter at this moment and fit the goal of providing valuable insight for the user's query best.

        Every insight is a card, here are the types that can be provided to the dashboard:
        - type LineData, CandleData and PieData: Charts for specific data series (PieData for numbers that always add up to 100 percent, CandleData for historical price data)
        - type KpiData: A singular relevant performance metric. A number with a footer text
        - type NewsData: A snippet of a relevant news article.
        - type TableData: A table of relevant data, like a summary.

        Generally, you are free to choose which insights you generate. However, you should follow these rules:
        - If a portfolio is given, always include a PieData chart that shows how their assets are distributed across different domains (available in the context data)
        - Do not make CandleData charts out of a single OHLC datapoint! Only if you have a series of OHLC points across different dates.
        - If you have multiple news articles given, only select one relevant headline at most!
        - ONLY use exactly the labels of the context data chunks to refer to them, like [Market_Data 1], [News 2] or [Portfolio_Dist].

        Context data:
        ${formatContextData(context)}

        Here is the user's question: ${userQuery}
        ${portfolio ? `If the user refers to a portfolio, then this is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : "There is no portfolio for this query."}

        Do NOT repeat the data, only refer to the label (e.g. [Market_Data 1]) of the context data, choose an insight type and describe in natural language what data goes into the insight card and how. Do NOT hallucinate, only generate insights from the context data you are given. Give every insight you generate a summarizing title. Example:
        <example>
        [Market_Data 1] Title: "Apple price change". Type: CandleData. Instructions: Show price changes from 2025-01-01 onwards.
        [Market_Data 2] Title: "Apple revenue". Type: KpiData. Instructions: Show revenue field (number: revenue, footer: "Revenue in 2023").
        [News 1] Title: title of the news article. Type: NewsData. Instructions: Display headline.
        </example>
        Additionally, write a short message in natural language (no more than 500 characters) in which you talk to the user directly and respond to their question, explaining what you curated and why. Do NOT put your message in quotes. Example:
        <example>
        The fluctuations of the tech market are indeed strong right now. I've gathered some insights for you that overlap with your portfolio which should help you decide how to move forward. Feel free to select what you're interested in the most!
        </example>

        What are the insights that you deem valuable enough for the user to gain knowledge for their situation? Your average output should be five insights, but it can be more or less depending on the situation! Think first before you respond.
    `.trim();
}

function generateInsightsLlmPromptWithInsights(context: ContextData, portfolio: any[] | undefined, insights: any, userQuery: string) {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely.

        In this stage, you decide which insights to generate for the user's dashboard based on the context data (from market APIs and other sources), the query they provided and if applicable, their portfolio. The information you're about to receive has been carefully curated and you have to decide which ones matter at this moment and fit the goal of providing valuable insight for the user's query best.

        Every insight is a card, here are the types that can be provided to the dashboard:
        - type LineData, CandleData and PieData: Charts for specific data series (PieData for numbers that always add up to 100 percent, CandleData for historical price data)
        - type KpiData: A singular relevant performance metric. A number with a footer text
        - type NewsData: A snippet of a relevant news article.
        - type TableData: A table of relevant data, like a summary.

        Generally, you are free to choose which insights you generate. However, you should follow these rules:
        - Do not make CandleData charts out of a single OHLC datapoint! Only if you have a series of OHLC points across different dates.
        - If you have multiple news articles given, only select one relevant headline at most!
        - ONLY use exactly the labels of the context data chunks to refer to them, like [Market_Data 1], [News 2] or [Portfolio_Dist].

        Context data:
        ${formatContextData(context)}

        Existing insights the user provided that are relevant to their question: ${JSON.stringify(insights)}

        Here is the user's question: ${userQuery}
        ${portfolio ? `If the user refers to a portfolio, then this is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : "There is no portfolio for this query."}

        Do NOT repeat the data, only refer to the label (e.g. [Market_Data 1]) of the context data, choose an insight type and describe in natural language what data goes into the insight card and how. Do NOT hallucinate, only generate insights from the context data you are given. Give every insight you generate a summarizing title. Example:
        <example>
        [Market_Data 1] Title: "Apple price change". Type: CandleData. Instructions: Show price changes from 2025-01-01 onwards.
        [Market_Data 2] Title: "Apple revenue". Type: KpiData. Instructions: Show revenue field (number: revenue, footer: "Revenue in 2023").
        [News 1] Title: title of the news article. Type: NewsData. Instructions: Display headline.
        </example>
        Additionally, write a short message in natural language (no more than 500 characters) in which you talk to the user directly and respond to their question, explaining what you curated and why. Do NOT put your message in quotes. Example:
        <example>
        The fluctuations of the tech market are indeed strong right now. I've gathered some insights for you that overlap with your portfolio which should help you decide how to move forward. Feel free to select what you're interested in the most!
        </example>

        What are the insights that you deem valuable enough for the user to gain knowledge for their situation? Your average output should be five insights, but it can be more or less depending on the situation! Think first before you respond.
    `.trim();
}

export const formatContextData = (data: ContextData): string => {
    // Format market data
    const marketDataFormatted = data.marketData.map((entry) => `[Market_Data ${entry.id}] ${entry.data}`).join("\n");

    // Format portfolio distribution
    const portfolioFormatted = data.portfolioDistribution ? `[Portfolio_Dist] ${data.portfolioDistribution}` : "";

    // Format news articles
    const newsFormatted = data.news.map((entry, index) => `[News ${index + 1}] ${entry}`).join("\n");

    // Combine all sections, removing any empty ones
    return [marketDataFormatted, portfolioFormatted, newsFormatted].filter(Boolean).join("\n\n");
};

function stripQuotes(input: string): string {
    if (input.startsWith('"') && input.endsWith('"')) {
        return input.slice(1, -1);
    }
    return input;
}