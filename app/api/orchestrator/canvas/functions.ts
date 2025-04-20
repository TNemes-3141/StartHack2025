export async function balance_sheet(
    symbol: string,
    period: string,
    limit: number,
    apiKey: string
): Promise<string> {
    try {
        limit = Math.min(limit, 5);
        const baseUrl = `https://financialmodelingprep.com/stable/balance-sheet-statement`;
        const url = `${baseUrl}?symbol=${encodeURIComponent(symbol)}&period=${encodeURIComponent(period)}&limit=${limit}&apikey=${encodeURIComponent(apiKey)}`;

        const response = await fetch(url);

        if (!response.ok) {
            return "";
        }

        const data = await response.json();
        return JSON.stringify(data);
    } catch (error) {
        return "";
    }
}

export async function company_profile(
    symbol: string,
    apiKey: string
): Promise<string> {
    try {
        const url = `https://financialmodelingprep.com/stable/profile?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;

        const response = await fetch(url);

        if (!response.ok) {
            return "";
        }

        const data = await response.json();
        return JSON.stringify(data);
    } catch (error) {
        return "";
    }
}

export async function daily_chart_eod(
    symbol: string,
    from: string,
    to: string,
    apiKey: string
): Promise<string> {
    try {
        const baseUrl = `https://financialmodelingprep.com/stable/historical-price-eod/full`;
        const url = `${baseUrl}?symbol=${encodeURIComponent(symbol)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&apikey=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return "";
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}

export async function full_quote(
    symbol: string,
    apiKey: string
): Promise<string> {
    try {
        const url = `https://financialmodelingprep.com/stable/quote?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return "";
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}

export async function intraday_chart(
    timeframe: string,
    symbol: string,
    from: string,
    to: string,
    extended: boolean,
    apiKey: string
): Promise<string> {
    try {
        const baseUrl = `https://financialmodelingprep.com/api/v3/historical-chart/${encodeURIComponent(timeframe)}/${encodeURIComponent(symbol)}`;
        const url = `${baseUrl}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&extended=${extended}&apikey=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return "";
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}

export async function key_metrics(
    symbol: string,
    limit: number,
    apiKey: string
): Promise<string> {
    try {
        limit = Math.min(limit, 5);
        const url = `https://financialmodelingprep.com/stable/key-metrics?symbol=${encodeURIComponent(symbol)}&limit=${limit}&apikey=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return "";
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}

export async function historical_market_cap(
    symbol: string,
    from: string,
    to: string,
    limit: number,
    apiKey: string
): Promise<string> {
    try {
        limit = Math.min(limit, 20);

        const inputDate = new Date(from);
        const today = new Date();
        const oneMonthBack = new Date();
        oneMonthBack.setMonth(today.getMonth() - 1);
        if (isNaN(inputDate.getTime())) {
            return "";
        }
        const cappedDate = inputDate < oneMonthBack ? oneMonthBack : inputDate;
        from = cappedDate.toISOString().split("T")[0];

        const url = `https://financialmodelingprep.com/stable/historical-market-capitalization?symbol=${encodeURIComponent(symbol)}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&limit=${limit}&apikey=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return "";
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}

export async function historical_sector_performance(
    limit: number,
    from: string,
    to: string,
    apiKey: string
): Promise<string> {
    try {
        limit = Math.min(limit, 20);
        const url = `https://financialmodelingprep.com/api/v3/historical-sectors-performance?limit=${limit}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&apikey=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return "";
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}

export async function stock_price_change(
    symbol: string,
    apiKey: string
): Promise<string> {
    try {
        const url = `https://financialmodelingprep.com/stable/stock-price-change?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
        const response = await fetch(url);
        if (!response.ok) {
            return "";
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}

export async function stock_screener(
    limit: number,
    apiKey: string,
    marketCapMoreThan?: number,
    marketCapLowerThan?: number,
    priceMoreThan?: number,
    priceLowerThan?: number,
    betaMoreThan?: number,
    betaLowerThan?: number,
    volumeMoreThan?: number,
    volumeLowerThan?: number,
    dividendMoreThan?: number,
    dividendLowerThan?: number,
    isEtf?: boolean,
    isFund?: boolean,
    isActivelyTrading?: boolean,
    sector?: string,
    industry?: string,
    country?: string,
    exchange?: string
): Promise<string> {
    try {
        limit = Math.min(limit, 10);
        const params = new URLSearchParams({ limit: limit.toString(), apiKey: apiKey });

        if (marketCapMoreThan !== undefined) params.append("marketCapMoreThan", marketCapMoreThan.toString());
        if (marketCapLowerThan !== undefined) params.append("marketCapLowerThan", marketCapLowerThan.toString());
        if (priceMoreThan !== undefined) params.append("priceMoreThan", priceMoreThan.toString());
        if (priceLowerThan !== undefined) params.append("priceLowerThan", priceLowerThan.toString());
        if (betaMoreThan !== undefined) params.append("betaMoreThan", betaMoreThan.toString());
        if (betaLowerThan !== undefined) params.append("betaLowerThan", betaLowerThan.toString());
        if (volumeMoreThan !== undefined) params.append("volumeMoreThan", volumeMoreThan.toString());
        if (volumeLowerThan !== undefined) params.append("volumeLowerThan", volumeLowerThan.toString());
        if (dividendMoreThan !== undefined) params.append("dividendMoreThan", dividendMoreThan.toString());
        if (dividendLowerThan !== undefined) params.append("dividendLowerThan", dividendLowerThan.toString());
        if (isEtf !== undefined) params.append("isEtf", isEtf.toString());
        if (isFund !== undefined) params.append("isFund", isFund.toString());
        if (isActivelyTrading !== undefined) params.append("isActivelyTrading", isActivelyTrading.toString());
        if (sector !== undefined) params.append("sector", sector);
        if (industry !== undefined) params.append("industry", industry);
        if (country !== undefined) params.append("country", country);
        if (exchange !== undefined) params.append("exchange", exchange);

        const url = `https://financialmodelingprep.com/api/v3/stock-screener?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            return "";
        }

        const data = await response.json();
        return JSON.stringify(data);
    } catch {
        return "";
    }
}
