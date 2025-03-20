import { getComponents } from "../../orchestrator/getComponents";
import { ContextData } from "../../orchestrator/getInsights";

export async function GET(request: Request) {
    const apiKey = process.env.OPENAI_API_KEY!;

    const finalData: ContextData = {
        sixData: ["{\"Apple Rg\":{\"Valor number\":\"908440\",\"Ticker symbol\":\"AAPL\",\"ISIN\":\"US0378331005\",\"Instrument type\":\"1 - \\\"Share, unit, particip. cert. in companies and cooperatives\\\" (1)\",\"Outstanding Securities\":\"15022073000\",\"Name\":\"Apple Rg\",\"open\":\"213.91\",\"close\":213.25,\"high\":\"217.47\",\"low\":\"212.925\",\"vol\":\"6063407\",\"Dividend policy\":null},\"Microsoft Rg\":{\"Valor number\":\"951692\",\"Ticker symbol\":\"MSFT\",\"ISIN\":\"US5949181045\",\"Instrument type\":\"1 - \\\"Share, unit, particip. cert. in companies and cooperatives\\\" (1)\",\"Outstanding Securities\":\"7433982235\",\"Name\":\"Microsoft Rg\",\"open\":\"385.23\",\"close\":385.12,\"high\":\"391.75\",\"low\":\"383.29\",\"vol\":\"1991005\",\"Dividend policy\":null},\"NVIDIA Rg\":{\"Valor number\":\"994529\",\"Ticker symbol\":\"NVDA\",\"ISIN\":\"US67066G1040\",\"Instrument type\":\"1 - \\\"Share, unit, particip. cert. in companies and cooperatives\\\" (1)\",\"Outstanding Securities\":\"24400000000\",\"Name\":\"NVIDIA Rg\",\"open\":\"116.5\",\"close\":118.34,\"high\":\"120.195\",\"low\":\"116.47\",\"vol\":\"23106338\",\"Dividend policy\":\"\\\"Quarterly\\\" (4)\"},\"Alphabet-A Rg\":{\"Valor number\":\"29798540\",\"Ticker symbol\":\"GOOGL\",\"ISIN\":\"US02079K3059\",\"Instrument type\":\"1 - \\\"Share, unit, particip. cert. in companies and cooperatives\\\" (1)\",\"Outstanding Securities\":\"5833000000\",\"Name\":\"Alphabet-A Rg\",\"open\":\"161.43\",\"close\":162.16,\"high\":\"164.88\",\"low\":\"160.97\",\"vol\":\"3542616\",\"Dividend policy\":\"\\\"Quarterly\\\" (4)\"},\"Amazon CDR Reg S\":{\"Valor number\":\"115486948\",\"Ticker symbol\":\"AMZN\",\"ISIN\":\"CA02315E1051\",\"Instrument type\":\"1 - \\\"Share, unit, particip. cert. in companies and cooperatives\\\" (1)\",\"Outstanding Securities\":null,\"Name\":\"Amazon CDR Reg S\",\"open\":\"27.17\",\"close\":23.04,\"high\":\"23.57\",\"low\":\"22.78\",\"vol\":\"35100\",\"Dividend policy\":null}}"],
        portfolioDistribution: "{\"Technology\": 55.5, \"Resources\": 33.3, \"Cash and other\": 11.2}",
        news: ["{\"headline\": \"Nvidia GTC: Here's what Wall Street is saying about Jensen Huang's performance \", \"excerpt\": \"Did Nvidia (NVDA) do enough to reawaken the bull narrative on the chipmaker's stock at its annual developer event? Wall Street is weighing in on that. First, consider the optics: CEO Jensen Huang wore his trademark black leather motorcycle jacket at the GTC event on Tuesday, not the shiny alligator leather one he donned for a keynote at the Consumer Electronics Show earlier this year.\", \"source\": \"https://markettradingessentials.com/2025/03/nvidia-gtc-heres-what-wall-street-is-saying-about-jensen-huangs-performance/\"}"],
    };
    const insights = `
    1. [Portfolio_Dist] Title: "Current Asset Distribution". Show a pie chart illustrating the distribution of the client's portfolio across Crypto (60%) and Bonds (40%).
    2. [SIX_Data 1] Title: "NVIDIA Price Fluctuations". Show in a candle chart to visualize the recent price movements of NVIDIA, highlighting the open, close, high, and low prices.
    3. [SIX_Data 1] Title: "Apple Stock Performance". Show the closing price of Apple as a KPI (number: 213.25, footer: "Closing price of Apple stock").
    4. [News 1] Title: "Nvidia Stock Rises Amid AI Demand". Show the relevant news snippet discussing NVIDIA's stock performance and the outlook on AI investments.
    `;

    try {
        const componentJson = await getComponents(finalData, insights, apiKey);

        console.log(componentJson);

        return new Response(null, {
            status: 200,
        });
    } catch (error) {
        console.error("Error in route:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}