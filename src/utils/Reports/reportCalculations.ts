import type { Transaction } from "../../features/Transactions/types/transactionTypes";
import type { Wallet } from "../../features/Wallets/types/walletTypes";

import type {
    ReportCategoryBreakdown,
    ReportData,
    ReportPeriod,
    ReportWallet,
} from "../../features/Reports/types/reportTypes";

interface Category {
    id: string;
    name: string;
}

interface BuildReportParams {
    transactions: Transaction[];
    wallets: Wallet[];
    categories: Category[];

    period: ReportPeriod;

    startDate: Date;
    endDate: Date;

    accountHolder: string;
    currency: string;
}

/* ============================================================
   DATE NORMALIZATION
============================================================ */

export const normalizeReportDate = (
    value: Date | string | { toDate: () => Date }
): Date => {
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

/* ============================================================
   PERIOD CHECK
============================================================ */

const isWithinPeriod = (
    transaction: Transaction,
    startDate: Date,
    endDate: Date
) => {
    const date = normalizeReportDate(transaction.date);

    return date >= startDate && date <= endDate;
};

/* ============================================================
   CATEGORY BREAKDOWN
============================================================ */

const buildCategoryBreakdown = (
    transactions: Transaction[],
    categories: Category[],
    total: number
): ReportCategoryBreakdown[] => {
    const grouped = new Map<string, number>();
    const counts = new Map<string, number>();

    transactions.forEach((transaction) => {
        grouped.set(
            transaction.categoryId,
            (grouped.get(transaction.categoryId) ?? 0) +
            transaction.amount
        );

        counts.set(
            transaction.categoryId,
            (counts.get(transaction.categoryId) ?? 0) + 1
        );
    });

    return Array.from(grouped.entries())
        .map(([categoryId, amount]) => {
            const category = categories.find(
                (item) => item.id === categoryId
            );

            return {
                categoryId,

                categoryName:
                    category?.name ?? "Unknown",

                amount,

                percentage:
                    total > 0
                        ? (amount / total) * 100
                        : 0,

                transactionCount:
                    counts.get(categoryId) ?? 0,
            };
        })
        .sort((a, b) => b.amount - a.amount);
};

/* ============================================================
   BUILD REPORT
============================================================ */

export const buildReportData = ({
    transactions,
    wallets,
    categories,

    period,

    startDate,
    endDate,

    accountHolder,
    currency,
}: BuildReportParams): ReportData => {
    /* ----------------------------------------------------------
       TRANSACTIONS IN PERIOD
    ---------------------------------------------------------- */

    const periodTransactions =
        transactions.filter((transaction) =>
            isWithinPeriod(
                transaction,
                startDate,
                endDate
            )
        );

    /* ----------------------------------------------------------
       COMPLETED TRANSACTIONS
    ---------------------------------------------------------- */

    const completedTransactions =
        periodTransactions.filter(
            (transaction) =>
                transaction.status === "completed"
        );

    /* ----------------------------------------------------------
       INCOME
    ---------------------------------------------------------- */

    const incomeTransactions =
        completedTransactions.filter(
            (transaction) =>
                transaction.type === "income"
        );

    const totalIncome =
        incomeTransactions.reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    /* ----------------------------------------------------------
       EXPENSES
    ---------------------------------------------------------- */

    const expenseTransactions =
        completedTransactions.filter(
            (transaction) =>
                transaction.type === "expense"
        );

    const totalExpenses =
        expenseTransactions.reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    /* ----------------------------------------------------------
       TRANSFERS
    ---------------------------------------------------------- */

    const transferTransactions =
        completedTransactions.filter(
            (transaction) =>
                transaction.type === "transfer"
        );

    const totalTransfers =
        transferTransactions.reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    /* ----------------------------------------------------------
       CATEGORY BREAKDOWNS
    ---------------------------------------------------------- */

    const incomeBreakdown =
        buildCategoryBreakdown(
            incomeTransactions,
            categories,
            totalIncome
        );

    const expenseBreakdown =
        buildCategoryBreakdown(
            expenseTransactions,
            categories,
            totalExpenses
        );

    const topExpenseCategories =
        expenseBreakdown.slice(0, 5);

    /* ----------------------------------------------------------
       TRANSACTION STATISTICS
    ---------------------------------------------------------- */

    const transactionStats = {
        total: periodTransactions.length,

        income: incomeTransactions.length,

        expenses: expenseTransactions.length,

        transfers: transferTransactions.length,

        pending:
            periodTransactions.filter(
                (transaction) =>
                    transaction.status === "pending"
            ).length,

        cancelled:
            periodTransactions.filter(
                (transaction) =>
                    transaction.status === "cancelled"
            ).length,
    };

    /* ----------------------------------------------------------
       WALLET REPORTS
    ---------------------------------------------------------- */

    const reportWallets: ReportWallet[] =
        wallets.map((wallet) => {
            const walletTransactions =
                periodTransactions.filter(
                    (transaction) =>
                        transaction.walletId === wallet.id ||
                        transaction.toWalletId === wallet.id
                );

            const income =
                walletTransactions
                    .filter(
                        (transaction) =>
                            transaction.walletId === wallet.id &&
                            transaction.type === "income" &&
                            transaction.status === "completed"
                    )
                    .reduce(
                        (sum, transaction) =>
                            sum + transaction.amount,
                        0
                    );

            const expenses =
                walletTransactions
                    .filter(
                        (transaction) =>
                            transaction.walletId === wallet.id &&
                            transaction.type === "expense" &&
                            transaction.status === "completed"
                    )
                    .reduce(
                        (sum, transaction) =>
                            sum + transaction.amount,
                        0
                    );

            const transfersIn =
                walletTransactions
                    .filter(
                        (transaction) =>
                            transaction.toWalletId === wallet.id &&
                            transaction.type === "transfer" &&
                            transaction.status === "completed"
                    )
                    .reduce(
                        (sum, transaction) =>
                            sum + transaction.amount,
                        0
                    );

            const transfersOut =
                walletTransactions
                    .filter(
                        (transaction) =>
                            transaction.walletId === wallet.id &&
                            transaction.type === "transfer" &&
                            transaction.status === "completed"
                    )
                    .reduce(
                        (sum, transaction) =>
                            sum + transaction.amount,
                        0
                    );

            /*
             * Find the earliest transaction for this wallet.
             * If balanceBefore exists, use it as opening balance.
             */
            const firstTransaction =
                walletTransactions
                    .slice()
                    .sort(
                        (a, b) =>
                            normalizeReportDate(
                                a.date
                            ).getTime() -
                            normalizeReportDate(
                                b.date
                            ).getTime()
                    )[0];

            const openingBalance =
                firstTransaction?.walletId === wallet.id
                    ? firstTransaction.balanceBefore ??
                    wallet.balance
                    : firstTransaction?.toWalletId ===
                        wallet.id
                        ? firstTransaction.toBalanceBefore ??
                        wallet.balance
                        : wallet.balance;

            /*
             * Current wallet balance is the safest closing
             * balance available from your existing model.
             */
            const closingBalance =
                wallet.balance;

            return {
                walletId: wallet.id,

                walletName: wallet.name,

                currency: wallet.currency,

                openingBalance,

                income,

                expenses,

                transfersIn,

                transfersOut,

                closingBalance,
            };
        });

    /* ----------------------------------------------------------
       OVERALL BALANCES
    ---------------------------------------------------------- */

    const openingBalance =
        reportWallets.reduce(
            (sum, wallet) =>
                sum + wallet.openingBalance,
            0
        );

    const closingBalance =
        reportWallets.reduce(
            (sum, wallet) =>
                sum + wallet.closingBalance,
            0
        );

    /* ----------------------------------------------------------
       REPORT ID
    ---------------------------------------------------------- */

    const datePart =
        endDate
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");

    const randomPart =
        Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();

    const reportId =
        `RPT-${datePart}-${randomPart}`;

    /* ----------------------------------------------------------
       FINAL REPORT
    ---------------------------------------------------------- */

    return {
        period,

        startDate,
        endDate,

        accountHolder,

        currency,

        openingBalance,

        totalIncome,

        totalExpenses,

        totalTransfers,

        closingBalance,

        incomeBreakdown,

        expenseBreakdown,

        topExpenseCategories,

        transactionStats,

        wallets: reportWallets,

        generatedAt: new Date(),

        reportId,
    };
};