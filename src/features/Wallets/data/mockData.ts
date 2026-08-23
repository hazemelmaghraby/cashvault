import type { Wallet } from "../types/walletTypes";

export const mockWallets: Wallet[] = [
  {
    id: "1",
    name: "Cash",
    balance: 1500,
    currency: "EGP",
    color: "#22c55e",
    icon: "wallet",
    type: "cash"
  },
  {
    id: "2",
    name: "CIB",
    balance: 8700,
    currency: "EGP",
    color: "#3b82f6",
    icon: "building",
    type: "bank"
  },
  {
    id: "3",
    name: "Vodafone Cash",
    balance: 950,
    currency: "EGP",
    color: "#ef4444",
    icon: "smartphone",
    type: "e-wallet"
  },
];