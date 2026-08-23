import {
    useEffect,
    useState,
} from "react";

import {
    convertCurrency,
} from "../utils/currency";

import type { Wallet } from "../features/Wallets/types/walletTypes";
import type { Transaction } from "../features/Transactions/types/transactionTypes";

export const useCurrencyTotals = (
    wallets: Wallet[],
    transactions: Transaction[],
    accountCurrency: string
) => {
    const [
        totalWalletsBalance,
        setTotalWalletsBalance,
    ] = useState(0);

    const [
        totalIncomeAmount,
        setTotalIncomeAmount,
    ] = useState(0);

    const [
        totalExpenseAmount,
        setTotalExpenseAmount,
    ] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const calculateTotals = async () => {
            try {
                /*
                ========================================
                Wallet Balance
                ========================================
                */

                const walletBalances =
                    await Promise.all(
                        wallets.map((wallet) =>
                            convertCurrency(
                                wallet.balance || 0,
                                wallet.currency,
                                accountCurrency
                            )
                        )
                    );

                /*
                ========================================
                Income
                ========================================
                */

                const incomeTransactions =
                    transactions.filter(
                        (transaction) =>
                            transaction.type ===
                            "income"
                    );

                const incomeAmounts =
                    await Promise.all(
                        incomeTransactions.map(
                            (transaction) =>
                                convertCurrency(
                                    transaction.amount || 0,
                                    transaction.currency,
                                    accountCurrency
                                )
                        )
                    );

                /*
                ========================================
                Expenses
                ========================================
                */

                const expenseTransactions =
                    transactions.filter(
                        (transaction) =>
                            transaction.type ===
                            "expense"
                    );

                const expenseAmounts =
                    await Promise.all(
                        expenseTransactions.map(
                            (transaction) =>
                                convertCurrency(
                                    transaction.amount || 0,
                                    transaction.currency,
                                    accountCurrency
                                )
                        )
                    );

                if (cancelled) {
                    return;
                }

                setTotalWalletsBalance(
                    walletBalances.reduce(
                        (sum, amount) =>
                            sum + amount,
                        0
                    )
                );

                setTotalIncomeAmount(
                    incomeAmounts.reduce(
                        (sum, amount) =>
                            sum + amount,
                        0
                    )
                );

                setTotalExpenseAmount(
                    expenseAmounts.reduce(
                        (sum, amount) =>
                            sum + amount,
                        0
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to calculate currency totals:",
                    error
                );
            }
        };

        calculateTotals();

        return () => {
            cancelled = true;
        };
    }, [
        wallets,
        transactions,
        accountCurrency,
    ]);

    return [
        totalWalletsBalance,
        totalIncomeAmount,
        totalExpenseAmount,
    ] as const;
};
