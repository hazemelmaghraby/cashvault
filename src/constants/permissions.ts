import type { UserRole } from "./types/RoleTypes";

export const PERMISSIONS = [
    "view_dashboard",

    "manage_wallets",
    "manage_transactions",
    "manage_categories",

    "view_users",
    "manage_users",

    "view_staff",
    "manage_staff",

    "moderate_content",

    "manage_settings",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    user: [
        "view_dashboard",
        "manage_wallets",
        "manage_transactions",
        "manage_categories",
    ],

    moderator: [
        "view_dashboard",
        "manage_wallets",
        "manage_transactions",
        "manage_categories",
        "moderate_content",
    ],

    staff: [
        "view_dashboard",
        "manage_wallets",
        "manage_transactions",
        "manage_categories",
        "moderate_content",
        "view_users",
    ],

    admin: [
        "view_dashboard",
        "manage_wallets",
        "manage_transactions",
        "manage_categories",
        "moderate_content",
        "view_users",
        "manage_users",
        "view_staff",
        "manage_staff",
        "manage_settings",
    ],

    owner: [
        "view_dashboard",
        "manage_wallets",
        "manage_transactions",
        "manage_categories",
        "moderate_content",
        "view_users",
        "manage_users",
        "view_staff",
        "manage_staff",
        "manage_settings",
    ],
};