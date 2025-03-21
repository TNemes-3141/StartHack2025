type QueryReturns = {
    items: string[],
    message: string
}

export async function getDataFromQuery(portfolio: any | undefined, history: any | undefined, insights: any | undefined, userQuery: string): Promise<QueryReturns | undefined> {
    try {
        const query = insights ? generateToolsLlmPromptWithInsights(portfolio, history, insights, userQuery) : generateToolsLlmPrompt(portfolio, history, userQuery);
        console.log("System prompt: " + query);

        const response = await fetch(`https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io/query?query=${query}`, {
            method: "POST",
        });
        const rawData = await response.json();
        console.log(rawData);
        
        // Ensure messages field exists
        const messages: any[] = rawData.messages ?? [];

        // Filter and extract valid "item" values
        const extractedItems: string[] = messages
            .filter(msg => 
            msg.name !== null &&
            typeof msg.item === "string" &&
            msg.item !== "{}" &&
            msg.item !== "[]")
            .map(msg => msg.item);
        
        const aiMessages: string[] = messages
            .filter(msg => msg.type === "ai" &&
                typeof msg.content === "string" &&
                msg.content.trim() !== "")
            .map(msg => msg.content);

        return {
            items: extractedItems,
            message: aiMessages.length > 0 ? aiMessages[0] : "",
        };
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}

function generateToolsLlmPrompt(portfolio: any | undefined, history: any | undefined, userQuery: string): string {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely.

        In this stage, you will write three queries to your tools (Summary, Search with criteria, Company data search, Historical price data). Do NOT use Winners_Losers, as its API is unavailable. Output the queries that should be made to these tools in their respectively correct formats. The results of the queries should be directly relevant to solve the user's question. Finally, write a short message (not longer than 500 characters) where you summerize what you did and answer the user in natural language if it was a question.

        ${portfolio ? `If the user refers to a portfolio, it means the portfolio of a client he manages. This is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : ""}

        ${history ? `Here is the conversation history that you should take into account: ${JSON.stringify(history)}` : ""}

        Here is the user's question: ${userQuery}

        What information would you retrieve from your tools to help the user solve his case? Think of companies whose data could be relevant. Make exactly three function calls! Think first before you respond.
    `.trim();
}

function generateToolsLlmPromptWithInsights(portfolio: any | undefined, history: any | undefined, insights: any, userQuery: string): string {
    return `
        You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

        You should adhere to the provided specifications completely.

        In this stage, you will understand the question of the user and the insight data it is based on, and then query your tools (Summary, Search with criteria, Company data search, Historical price data) to help him. Do NOT use Winners_Losers, as its API is unavailable. Output the queries that should be made to these tools in their respectively correct formats. The results of the queries should be directly relevant to solve the user's question in dependency of the data provided. Finally, write a short message (not longer than 500 characters) where you answer the user in natural language.

        ${portfolio ? `If the user refers to a portfolio, it means the portfolio of a client he manages. This is the portfolio you should base your understanding of the user's question on: ${JSON.stringify(portfolio)}` : ""}

        ${history ? `Here is the conversation history that you should take into account: ${JSON.stringify(history)}` : ""}

        Here is data from insights (tables, charts, news articles) already generated that played a role earlier in the conversation; the user has selected them actively because he thinks they are relevant to their query, so you should pay attention to them: ${JSON.stringify(insights)}

        Here is the user's question: ${userQuery}

        What information would you retrieve from your tools to help the user solve his case or explain the correlations he is interested in? Make function calls where necessary. Think first before you respond.
    `.trim();
}