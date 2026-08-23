export interface Transaction {
    id: string;
    type: (typeof TRANSACTION_TYPES[number]["value"]);

    walletId: string;
    toWalletId?: string;

    title: string;
    amount: number;

    description?: string;
    categoryId: string;

    date: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;

    // Source / normal transaction wallet
    balanceBefore?: number;
    balanceAfter?: number;

    // Transfer destination wallet
    toBalanceBefore?: number;
    toBalanceAfter?: number;

    receiptId?: string;

    currency: string;
    status: "completed" | "pending" | "cancelled";
}

export const TRANSACTION_TYPES = [
    {
        value: "income",
        label: "Income",
    },
    {
        value: "expense",
        label: "Expense",
    },
    {
        value: "transfer",
        label: "Transfer",
    },
] as const;

export const TRANSACTION_CATEGORIES = [
    {
        value: "food",
        label: "Food",
    },
    {
        value: "transportation",
        label: "Transportation",
    },
    {
        value: "entertainment",
        label: "Entertainment",
    },
    {
        value: "shopping",
        label: "Shopping",
    },
    {
        value: "utilities",
        label: "Utilities",
    },
    {
        value: "health",
        label: "Health",
    },
    {
        value: "education",
        label: "Education",
    },
    {
        value: "travel",
        label: "Travel",
    },
    {
        value: "others",
        label: "Others"
    }] as const;