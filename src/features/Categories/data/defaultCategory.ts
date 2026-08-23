import type { Category } from "../types/categoryTypes";

export const DEFAULT_CATEGORIES: Category[] = [
    {
        id: "cat-food",
        name: "Food",
        type: "expense",
        color: "#EF4444",
        icon: "utensils",
    },
    {
        id: "cat-transport",
        name: "Transportation",
        type: "expense",
        color: "#F59E0B",
        icon: "car",
    },
    {
        id: "cat-shopping",
        name: "Shopping",
        type: "expense",
        color: "#8B5CF6",
        icon: "shopping-bag",
    },
    {
        id: "cat-bills",
        name: "Bills",
        type: "expense",
        color: "#3B82F6",
        icon: "receipt",
    },
    {
        id: "cat-entertainment",
        name: "Entertainment",
        type: "expense",
        color: "#EC4899",
        icon: "gamepad",
    },
    {
        id: "cat-salary",
        name: "Salary",
        type: "income",
        color: "#22C55E",
        icon: "wallet",
    },
    {
        id: "cat-freelance",
        name: "Freelance",
        type: "income",
        color: "#14B8A6",
        icon: "briefcase",
    },
    {
        id: "cat-family",
        name: "Family",
        type: "income",
        color: "#55cfff",
        icon: "profile",
    },
];