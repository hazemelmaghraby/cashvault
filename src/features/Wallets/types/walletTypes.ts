export interface Wallet {
    id: string;
    name: string;
    balance: number;
    currency: string;
    color: string;
    type: (typeof WALLET_TYPES[number]["value"]);
    icon?: string;
};

export const WALLET_TYPES = [
    {
        value: "cash",
        label: "Cash",
    },
    {
        value: "bank",
        label: "Bank",
    },
    {
        value: "e-wallet",
        label: "E-Wallet",
    },
] as const;