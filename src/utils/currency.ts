
export type CurrencyCode =
    | "EGP"
    | "USD"
    | "EUR"
    | "GBP";

type ExchangeRateResponse = {
    date: string;
    base: string;
    quote: string;
    rate: number;
};

const rateCache = new Map<
    string,
    {
        rate: number;
        timestamp: number;
    }
>();

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const convertCurrency = async (
    amount: number,
    fromCurrency: string,
    toCurrency: string
): Promise<number> => {
    if (
        !amount ||
        fromCurrency === toCurrency
    ) {
        return amount;
    }

    const cacheKey =
        `${fromCurrency}_${toCurrency}`;

    const cachedRate =
        rateCache.get(cacheKey);

    if (
        cachedRate &&
        Date.now() - cachedRate.timestamp <
        CACHE_DURATION
    ) {
        return amount * cachedRate.rate;
    }

    const response = await fetch(
        `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch exchange rate: ${fromCurrency} → ${toCurrency}`
        );
    }

    const data =
        (await response.json()) as ExchangeRateResponse;

    rateCache.set(cacheKey, {
        rate: data.rate,
        timestamp: Date.now(),
    });

    return amount * data.rate;
};
