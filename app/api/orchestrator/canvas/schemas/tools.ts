import OpenAI from "openai"

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
        "type": "function",
        "function": {
            "name": "balance_sheet",
            "description": "Get the balance sheet for a company as reported by the company, without any adjustments. This endpoint can be used to assess a company's financial health and to identify potential risks.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "symbol",
                    "period",
                    "limit"
                ],
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "Ticker symbol of the company"
                    },
                    "period": {
                        "type": "string",
                        "description": "The period of the balance sheet data, can be 'annual' or 'quarter'"
                    },
                    "limit": {
                        "type": "number",
                        "description": "Maximum number of records to return"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "company_profile",
            "description": "Get a comprehensive overview of a company with this Company Profile endpoint. This provides key information such as price, beta, market capitalization, industry, description in natural language, headquarters, senior management, employee count, and more.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "symbol"
                ],
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "The stock ticker symbol for the company"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "daily_chart_eod",
            "description": "Fetches daily stock data for a specified company, including opening, high, low, and closing prices.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "symbol",
                    "from",
                    "to",
                    "serietype"
                ],
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "The stock ticker symbol for the company (e.g., AAPL)"
                    },
                    "from": {
                        "type": "string",
                        "description": "Start date for historical data in YYYY-MM-DD format"
                    },
                    "to": {
                        "type": "string",
                        "description": "End date for historical data in YYYY-MM-DD format"
                    },
                    "serietype": {
                        "type": "string",
                        "description": "The type of series to return, e.g., 'line'"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "full_quote",
            "description": "This endpoint gives you the latest bid and ask prices for a stock, as well as the volume, last trade price, earnings announcements and outstanding shares in real time.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "symbol"
                ],
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "The stock symbol for which to retrieve the quote"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "intraday_chart",
            "description": "Provides an intraday chart for a given company. The chart displays the stock price of the company at different time intervals throughout the day.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "timeframe",
                    "symbol",
                    "from",
                    "to",
                    "extended"
                ],
                "properties": {
                    "timeframe": {
                        "type": "string",
                        "description": "Time interval for the intraday chart (e.g., 1min, 5min, 15min, 30min, 1hour, 4hour)"
                    },
                    "symbol": {
                        "type": "string",
                        "description": "Stock ticker symbol of the company (e.g., AAPL)"
                    },
                    "from": {
                        "type": "string",
                        "description": "Start date for the intraday data in YYYY-MM-DD format"
                    },
                    "to": {
                        "type": "string",
                        "description": "End date for the intraday data in YYYY-MM-DD format"
                    },
                    "extended": {
                        "type": "boolean",
                        "description": "Whether to include extended hours data (default is false)"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "key_metrics",
            "description": "Get key financial metrics for a company, including revenue, net income, and price-to-earnings ratio (P/E ratio). Assess a company's financial performance and compare it to its competitors.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "symbol",
                    "period",
                    "limit"
                ],
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "Ticker symbol of the company"
                    },
                    "period": {
                        "type": "string",
                        "description": "Period for the metrics (e.g., 'annual' or 'quarter')"
                    },
                    "limit": {
                        "type": "number",
                        "description": "Maximum number of records to retrieve"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "historical_market_cap",
            "description": "Offers comprehensive historical market capitalization data for companies, enabling users to analyze the company's growth trajectory and identify performance trends over time. Each query is limited to a maximum of five years of data.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "symbol",
                    "from",
                    "to",
                    "limit"
                ],
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "The stock symbol of the company"
                    },
                    "from": {
                        "type": "string",
                        "description": "Start date for retrieving historical market cap data in YYYY-MM-DD format"
                    },
                    "to": {
                        "type": "string",
                        "description": "End date for retrieving historical market cap data in YYYY-MM-DD format"
                    },
                    "limit": {
                        "type": "number",
                        "description": "Maximum number of records to return"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "historical_sector_performance",
            "description": "Provides historical data on the performance of each sector of the stock market (e.g. comm services, energy, healthcare, technology etc.), helping investors identify trends and make informed investment decisions.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "limit",
                    "from",
                    "to"
                ],
                "properties": {
                    "limit": {
                        "type": "number",
                        "description": "The maximum number of historical records to return."
                    },
                    "from": {
                        "type": "string",
                        "description": "Start date for the historical data in YYYY-MM-DD format."
                    },
                    "to": {
                        "type": "string",
                        "description": "End date for the historical data in YYYY-MM-DD format."
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "stock_price_change",
            "description": "This endpoint gives you the change in a stock's price over a given period of time, from 1 day up to 10 years.",
            "strict": true,
            "parameters": {
                "type": "object",
                "required": [
                    "symbol"
                ],
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "Stock ticker symbol"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "stock_screener",
            "description": "Find stocks that meet specific investment criteria. This endpoint allows you to search for stocks based on various criteria, such as market cap, price, volume, beta, sector, and country.",
            "parameters": {
                "type": "object",
                "required": [
                    "limit"
                ],
                "properties": {
                    "limit": {
                        "type": "number",
                        "description": "The maximum number of stock results to return"
                    },
                    "marketCapMoreThan": {
                        "type": "number",
                        "description": "Filter for stocks with a market cap greater than this value"
                    },
                    "marketCapLowerThan": {
                        "type": "number",
                        "description": "Filter for stocks with a market cap less than this value"
                    },
                    "priceMoreThan": {
                        "type": "number",
                        "description": "Filter for stocks with a price greater than this value"
                    },
                    "priceLowerThan": {
                        "type": "number",
                        "description": "Filter for stocks with a price less than this value"
                    },
                    "betaMoreThan": {
                        "type": "number",
                        "description": "Filter for stocks with a beta greater than this value"
                    },
                    "betaLowerThan": {
                        "type": "number",
                        "description": "Filter for stocks with a beta less than this value"
                    },
                    "volumeMoreThan": {
                        "type": "number",
                        "description": "Filter for stocks with a volume greater than this value"
                    },
                    "volumeLowerThan": {
                        "type": "number",
                        "description": "Filter for stocks with a volume less than this value"
                    },
                    "dividendMoreThan": {
                        "type": "number",
                        "description": "Filter for stocks with a dividend greater than this value"
                    },
                    "dividendLowerThan": {
                        "type": "number",
                        "description": "Filter for stocks with a dividend less than this value"
                    },
                    "isEtf": {
                        "type": "boolean",
                        "description": "Filter to return only ETFs if true"
                    },
                    "isFund": {
                        "type": "boolean",
                        "description": "Filter to return only funds if true"
                    },
                    "isActivelyTrading": {
                        "type": "boolean",
                        "description": "Filter for stocks that are actively trading if true"
                    },
                    "sector": {
                        "type": "string",
                        "description": "Filter for stocks in a specific sector"
                    },
                    "industry": {
                        "type": "string",
                        "description": "Filter for stocks in a specific industry"
                    },
                    "country": {
                        "type": "string",
                        "description": "Filter for stocks based in a specific country"
                    },
                    "exchange": {
                        "type": "string",
                        "description": "Filter for stocks listed on a specific exchange"
                    }
                }
            }
        }
    }
]