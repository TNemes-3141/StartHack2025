import { getDataFromQuery } from "./getDataFromQuery";
import { balance_sheet, company_profile, daily_chart_eod, full_quote, historical_market_cap, historical_sector_performance, intraday_chart, key_metrics, stock_price_change, stock_screener } from "./functions";

import { getSummary, getCompanyDataSearch, getOhlcv, getSearchWithCriteria } from "./utils";
import { getPortfolioDistribution } from "./getPortfolioDistribution";
import { getNewsArticle } from "./getNewsArticle";
import { ContextData, getInsights } from "./getInsights";
import { getComponents } from "./getComponents";

import OpenAI from "openai";


type FunctionCallResult = {
    id: number;
    data: string;
};

export type FunctionCall = {
    id: number,
    name: string,
    arguments: Record<string, any>
}

const functionMap: Record<string, Function> = {
    balance_sheet,
    company_profile,
    daily_chart_eod,
    full_quote,
    intraday_chart,
    key_metrics,
    historical_market_cap,
    historical_sector_performance,
    stock_price_change,
    stock_screener
  };

export async function POST(request: Request) {
    try {
        // Parse request body
        const { query, portfolio, conversationHistory, insightData } = await request.json();

        const apiKey = process.env.OPENAI_API_KEY!;
        const openai = new OpenAI({
            apiKey: apiKey,
        });
        const fmpApiKey = process.env.FMP_API_KEY!;

        if (!query && !portfolio && !conversationHistory) {
            return new Response(JSON.stringify({ error: "Missing data" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log("Begin orchestrator!");

        // Placeholder response (we will add logic later)
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Step 1: Send user query and portfolio to QUERY for data
                    await sendMessage(controller, encoder, "Devising strategy for problem solving...");

                    const functionCalls = await getDataFromQuery(openai, portfolio, conversationHistory, insightData, query) ?? [];

                    console.log("We are doing " + functionCalls.length + " function calls");
                    console.log(functionCalls);

                    // Step 2: Gather data from API endpoints
                    await sendMessage(controller, encoder, "Gathering data...");
                    const functionCallResults = await executeFunctionCalls(functionCalls, fmpApiKey, functionMap);

                    console.log("Results:");
                    console.log(functionCallResults);

                    /*const toolList = dataResults.map((objStr) => JSON.parse(objStr));
                    console.log(toolList.length)

                    let restructuredData: string[] = [];

                    if (toolList.length > 0) {
                        for (const tool of toolList) {
                            console.log(`Processing ${tool.tool}...`);

                            let result: string | undefined = undefined;

                            switch (tool.tool) {
                                case "Summary":
                                    result = getSummary(tool.data);
                                    break;
                                case "PkData":
                                    result = getCompanyDataSearch(tool.data);
                                    break;
                                case "SearchWithCriteria":
                                    result = getSearchWithCriteria(tool.data);
                                    console.log("Fresh data: " + result)
                                    break;
                                case "OHLC":
                                    result = getOhlcv(tool.data);
                                    break;
                                default:
                                    console.warn(`Unknown tool: ${tool.tool}`);
                            }

                            if (result) {
                                restructuredData.push(result);
                            }
                        }
                    }

                    let portfolioDistribution: string | undefined = undefined
                    const insightDataPresent: boolean = (insightData && insightData.length > 0);
                    // Step 2: Get portfolio distribution if applicable
                    if (portfolio && !insightDataPresent ) {
                        await sendMessage(controller, encoder, "Analyzing client portfolio...");

                        const dist = await getPortfolioDistribution(portfolio) ?? undefined;
                        if (dist && dist.length > 0) {
                            portfolioDistribution = dist[0];
                        }
                    }

                    // Step 3: Get news coverage from Milvus
                    await sendMessage(controller, encoder, "Collecting relevant news articles...");
                    const news = await getNewsArticle(query, apiKey) ?? "";

                    // Step 4: Generate insights
                    const finalData: ContextData = {
                        sixData: restructuredData,
                        portfolioDistribution: portfolioDistribution ?? "",
                        news: [news],
                    };
                    await sendMessage(controller, encoder, "Building insights...");
                    const insights = await getInsights(finalData, portfolio, insightData, query);
                    console.log(insights);

                    // Step 5: Generate JSON
                    if (!insights || insights.length == 0) {
                        await sendMessage(controller, encoder, `FINAL_JSON:[]`, 500);
                        controller.close(); // Close the stream when finished
                    }
                    else {
                        const componentJson = await getComponents(finalData, insights[0], apiKey);
                        console.log("Components: " + componentJson);

                        // Send final JSON payload as the last message
                        await sendMessage(controller, encoder, componentJson ?
                            `FINAL_JSON:${componentJson}:END_JSON:${queryResults.message}` :
                            `FINAL_JSON:[]:END_JSON:${queryResults.message}`, 500);
                        controller.close(); // Close the stream when finished
                    }*/
                    await sendMessage(controller, encoder, "Done!", 500);
                    controller.close();
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

async function executeFunctionCalls(
    calls: FunctionCall[],
    apiKey: string,
    functionMap: Record<string, Function>
): Promise<FunctionCallResult[]> {
    const results: FunctionCallResult[] = [];

    for (const call of calls) {
        const fn = functionMap[call.name];
        if (typeof fn !== "function") {
            results.push({ id: call.id, data: "" });
            continue;
        }

        try {
            const argsWithKey = { ...call.arguments, apiKey };
            const result = await fn(...Object.values(argsWithKey));
            results.push({ id: call.id, data: result });
        } catch {
            results.push({ id: call.id, data: "" });
        }
    }

    return results;
}