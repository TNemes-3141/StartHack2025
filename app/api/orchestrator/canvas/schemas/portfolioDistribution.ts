import { ResponseFormatJSONSchema } from "openai/resources/shared";

export const portfolioDistribution: ResponseFormatJSONSchema = {
    type: "json_schema",
    json_schema: {
        name: "portfolio_distribution",
        schema: {
            type: "object",
            properties: {
                "Basic Materials": {
                    type: "number",
                    description: "The share of Basic Materials in the portfolio."
                },
                "Communication Services": {
                    type: "number",
                    description: "The share of Communication Services in the portfolio."
                },
                "Consumer Cyclical": {
                    type: "number",
                    description: "The share of Consumer Cyclical in the portfolio."
                },
                "Consumer Defensive": {
                    type: "number",
                    description: "The share of Consumer Defensive in the portfolio."
                },
                "Energy": {
                    type: "number",
                    description: "The share of Energy in the portfolio."
                },
                "Financial Services": {
                    type: "number",
                    description: "The share of Financial Services in the portfolio."
                },
                "Healthcare": {
                    type: "number",
                    description: "The share of Healthcare in the portfolio."
                },
                "Industrials": {
                    type: "number",
                    description: "The share of Industrials in the portfolio."
                },
                "Real Estate": {
                    type: "number",
                    description: "The share of Real Estate in the portfolio."
                },
                "Technology": {
                    type: "number",
                    description: "The share of Technology in the portfolio."
                },
                "Utilities": {
                    type: "number",
                    description: "The share of Utilities in the portfolio."
                }
            },
            required: [
                "Basic Materials",
                "Communication Services",
                "Consumer Cyclical",
                "Consumer Defensive",
                "Energy",
                "Financial Services",
                "Healthcare",
                "Industrials",
                "Real Estate",
                "Technology",
                "Utilities"
            ],
            additionalProperties: false,
        },
        strict: true,
    },
};