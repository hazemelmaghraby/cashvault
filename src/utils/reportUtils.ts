import type { Transaction } from "../features/Transactions/types/transactionTypes";

export type ReportPeriod = "daily" | "weekly" | "monthly";

export interface ReportRange {
    start: Date;
    end: Date;
}

export interface ReportTotals {
    income: number;
    expenses: number;
    net: number;
    transactionCount: number;
}

const toDate = (value: Date | string | { toDate: () => Date }): Date => {
    if (value instanceof Date) {
        return value;
    }

    if (typeof value === "string") {
        return new Date(value);
    }

    if (
        value &&
        typeof value === "object" &&
        "toDate" in value &&
        typeof value.toDate === "function"
    ) {
        return value.toDate();
    }

    return new Date();
};

export const getReportRange = (
    period: ReportPeriod,
    date: Date
): ReportRange => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (period === "daily") {
        return {
            start: new Date(year, month, day, 0, 0, 0, 0),
            end: new Date(year, month, day, 23, 59, 59, 999),
        };
    }

    if (period === "weekly") {
        const currentDay = date.getDay();

        // Sunday = 0
        const start = new Date(date);
        start.setDate(day - currentDay);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return {
            start,
            end,
        };
    }

    return {
        start: new Date(year, month, 1, 0, 0, 0, 0),
        end: new Date(year, month + 1, 0, 23, 59, 59, 999),
    };
};

export const getReportTotals = (
    transactions: Transaction[],
    range: ReportRange
): ReportTotals => {
    let income = 0;
    let expenses = 0;
    let transactionCount = 0;

    for (const transaction of transactions) {
        const transactionDate = toDate(transaction.date);

        if (Number.isNaN(transactionDate.getTime())) {
            continue;
        }

        if (
            transactionDate < range.start ||
            transactionDate > range.end
        ) {
            continue;
        }

        if (transaction.status !== "completed") {
            continue;
        }

        // Transfers are wallet movements, NOT income/expenses.
        if (transaction.type === "transfer") {
            continue;
        }

        transactionCount++;

        if (transaction.type === "income") {
            income += transaction.amount;
        }

        if (transaction.type === "expense") {
            expenses += transaction.amount;
        }
    }

    return {
        income,
        expenses,
        net: income - expenses,
        transactionCount,
    };
};

export const shiftReportDate = (
    period: ReportPeriod,
    date: Date,
    direction: -1 | 1
): Date => {
    const result = new Date(date);

    if (period === "daily") {
        result.setDate(result.getDate() + direction);
    }

    if (period === "weekly") {
        result.setDate(result.getDate() + direction * 7);
    }

    if (period === "monthly") {
        result.setMonth(result.getMonth() + direction);
    }

    return result;
};

export const formatReportPeriod = (
    period: ReportPeriod,
    range: ReportRange
): string => {
    if (period === "daily") {
        return range.start.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    if (period === "weekly") {
        const start = range.start.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });

        const end = range.end.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        return `${start} – ${end}`;
    }

    return range.start.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });
};