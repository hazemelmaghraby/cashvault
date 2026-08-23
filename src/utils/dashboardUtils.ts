import type { Transaction } from "../features/Transactions/types/transactionTypes";

export const getRecentTransactions = (
    transactions: Transaction[]
) => {
    return [...transactions]
        .sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        )
        .slice(0, 5);
};

export const getMonthlyFinancialData = (
    transactions: Transaction[]
) => {
    const currentDate = new Date();

    const monthlyData = Array.from(
        { length: 6 },
        (_, index) => {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - (5 - index),
                1
            );

            return {
                month: date.toLocaleString("default", {
                    month: "short",
                }),
                monthIndex: date.getMonth(),
                year: date.getFullYear(),
                income: 0,
                expenses: 0,
            };
        }
    );

    transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);

        const month = transactionDate.getMonth();
        const year = transactionDate.getFullYear();

        const matchingMonth = monthlyData.find(
            (item) =>
                item.monthIndex === month &&
                item.year === year
        );

        if (!matchingMonth) return;

        if (transaction.type === "income") {
            matchingMonth.income += transaction.amount;
        }

        if (transaction.type === "expense") {
            matchingMonth.expenses += transaction.amount;
        }
    });

    return monthlyData;
};