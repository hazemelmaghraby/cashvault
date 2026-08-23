import type { UserRole } from "./types/RoleTypes";

export type RoleTheme = {
    label: string;
    description: string;

    accent: string;
    accentSoft: string;
    accentBorder: string;

    avatar: string;
    avatarGlow: string;

    badge: string;
    badgeText: string;

    background: string;
    cardGlow: string;

    animation: "none" | "subtle" | "premium";

    icon: string;
};

export const ROLE_THEMES: Record<UserRole, RoleTheme> = {
    user: {
        label: "User",
        description: "Personal account",

        accent: "violet",
        accentSoft: "violet-soft",
        accentBorder: "violet-border",

        avatar: "violet-avatar",
        avatarGlow: "violet-glow",

        badge: "violet-badge",
        badgeText: "violet-text",

        background: "violet-background",
        cardGlow: "violet-card-glow",

        animation: "subtle",

        icon: "user",
    },

    moderator: {
        label: "Moderator",
        description: "Community moderation",

        accent: "blue",
        accentSoft: "blue-soft",
        accentBorder: "blue-border",

        avatar: "blue-avatar",
        avatarGlow: "blue-glow",

        badge: "blue-badge",
        badgeText: "blue-text",

        background: "blue-background",
        cardGlow: "blue-card-glow",

        animation: "subtle",

        icon: "shield",
    },

    staff: {
        label: "Staff",
        description: "CashVault operations",

        accent: "emerald",
        accentSoft: "emerald-soft",
        accentBorder: "emerald-border",

        avatar: "emerald-avatar",
        avatarGlow: "emerald-glow",

        badge: "emerald-badge",
        badgeText: "emerald-text",

        background: "emerald-background",
        cardGlow: "emerald-card-glow",

        animation: "subtle",

        icon: "briefcase",
    },

    admin: {
        label: "Administrator",
        description: "System administration",

        accent: "amber",
        accentSoft: "amber-soft",
        accentBorder: "amber-border",

        avatar: "amber-avatar",
        avatarGlow: "amber-glow",

        badge: "amber-badge",
        badgeText: "amber-text",

        background: "amber-background",
        cardGlow: "amber-card-glow",

        animation: "subtle",

        icon: "shield-check",
    },

    owner: {
        label: "Owner",
        description: "System owner",

        accent: "gold",
        accentSoft: "gold-soft",
        accentBorder: "gold-border",

        avatar: "gold-avatar",
        avatarGlow: "gold-glow",

        badge: "gold-badge",
        badgeText: "gold-text",

        background: "gold-background",
        cardGlow: "gold-card-glow",

        animation: "premium",

        icon: "crown",
    },
};

export const getRoleTheme = (
    role: UserRole
): RoleTheme => {
    return ROLE_THEMES[role] ?? ROLE_THEMES.user;
};