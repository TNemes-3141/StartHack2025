import { ContextData } from "./route";
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

        const response = await ai.responses.create({
            model: "o4-mini",
            reasoning: { effort: "medium" },
            input: [
                {
                    role: "user",
                    content: query,
                },
            ],
        });

        const r = response.output_text;

        if (!r || r.length == 0) {
            return {
                insights: "",
                message: "",
            };
        }

        const insights = extractInsightsText(r);
        const message = extractMessageText(r);

        return {
            insights: insights,
            message: message
        };
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
        - If a portfolio is given, always include a pie chart that shows how their assets are distributed across different domains (available in the context data)
        - Do not make candle charts out of a single OHLC datapoint! Only if you have a series of OHLC points across different dates.
        - If you have multiple news articles given, only select one relevant headline at most!
        - ONLY use the labels of the context data chunks to refer to them, like [Market_Data 1], [News 2] or [Portfolio_Dist].

        Context data:
        ${formatContextData(context)}

        Here is the user's question: ${userQuery}
        ${portfolio ? `If the user refers to a portfolio, then this is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : "There is no portfolio for this query."}

        Do NOT repeat the data, only refer to the label (e.g. [Market_Data 1]) of the context data and describe in natural language what data goes into the insight card and how. Do NOT hallucinate, only generate insights from the context data you are given. Give every insight you generate a summarizing title and put this part in <insights></insights> tags. Example:
        <insights>
        [Market_Data 1] Title: "Apple price change". Show in CandleData.
        [Market_Data 2] Title: "Apple revenue". Show revenue field as KpiData (number: revenue, footer: "Revenue in 2023")
        [News 1] Title: title of the news article. Show in NewsData.
        </insights>
        After that, write a short message in natural language (no more than 500 characters) in which you talk to the user directly and respond to their question. Put this part in <message></message> tags. Example:
        <message>
        The fluctuations of the tech market are indeed strong right now. I've gathered some insights for you that overlap with your portfolio which should help you decide how to move forward. Feel free to select what you're interested in the most!
        </message>

        Your response should ONLY contain these two components (i.e. <insights> and <message>). What are the insights that you deem valuable enough for the user to gain knowledge for their situation? Your average output should be five insights, but it can be more or less depending on the situation! Think first before you respond.
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
        - Do not make candle charts out of a single OHLC datapoint! Only if you have a series of OHLC points across different dates.
        - If you have multiple news articles given, only select one relevant headline at most!
        - ONLY use the labels of the context data chunks to refer to them, like [Market_Data 1], [News 2].

        Context data:
        ${formatContextData(context)}

        Existing insights the user provided that are relevant to their question: ${JSON.stringify(insights)}

        Here is the user's question: ${userQuery}
        ${portfolio ? `If the user refers to a portfolio, then this is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : "There is no portfolio for this query."}

        Do NOT repeat the data, only refer to the label (e.g. [Market_Data 1]) of the context data and describe in natural language what data goes into the insight card and how. Do NOT hallucinate, only generate insights from the context data you are given. Give every insight you generate a summarizing title and put this part in <insights></insights> tags. Example:
        <insights>
        [Market_Data 1] Title: "Apple price change". Show in CandleData.
        [Market_Data 2] Title: "Apple revenue". Show revenue field as KpiData (number: revenue, footer: "Revenue in 2023")
        [News 1] Title: title of the news article. Show in NewsData.
        </insights>
        After that, write a short message in natural language (no more than 500 characters) in which you talk to the user directly and respond to their question. Put this part in <message></message> tags. Example:
        <message>
        The fluctuations of the tech market are indeed strong right now. I've gathered some insights for you that overlap with your portfolio which should help you decide how to move forward. Feel free to select what you're interested in the most!
        </message>

        Your response should ONLY contain these two components (<insights> and <message>). What are the insights that you deem valuable enough for the user to gain knowledge for their situation? Your average output should be five insights, but it can be more or less depending on the situation! Think first before you respond.
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

const extractInsightsText = (input: string): string => {
    const regex = /<insights>([\s\S]*?)<\/insights>/g;
    const matches = Array.from(input.matchAll(regex)); // Convert to array

    return matches.map(match => match[1])[0]; // Extract text inside the tags
};

const extractMessageText = (input: string): string => {
    const regex = /<message>([\s\S]*?)<\/message>/g;
    const matches = Array.from(input.matchAll(regex)); // Convert to array

    return matches.map(match => match[1])[0]; // Extract text inside the tags
};