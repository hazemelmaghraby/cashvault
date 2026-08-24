export type ReportPeriod = "daily" | "weekly" | "monthly";

export interface ReportCategoryBreakdown {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    transactionCount: number;
}

export interface ReportTransactionStats {
    total: number;
    income: number;
    expenses: number;
    transfers: number;
    pending: number;
    cancelled: number;
}

export interface ReportWallet {
    walletId: string;
    walletName: string;
    currency: string;
    openingBalance: number;
    income: number;
    expenses: number;
    transfersIn: number;
    transfersOut: number;
    closingBalance: number;
}

export interface ReportData {
    period: ReportPeriod;

    startDate: Date;
    endDate: Date;

    accountHolder: string;
    currency: string;

    openingBalance: number;
    totalIncome: number;
    totalExpenses: number;
    totalTransfers: number;
    closingBalance: number;

    incomeBreakdown: ReportCategoryBreakdown[];
    expenseBreakdown: ReportCategoryBreakdown[];

    topExpenseCategories: ReportCategoryBreakdown[];

    transactionStats: ReportTransactionStats;

    wallets: ReportWallet[];

    generatedAt: Date;
    reportId: string;
}