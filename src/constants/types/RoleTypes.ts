export const USER_ROLES = [
    "user",
    "moderator",
    "staff",
    "admin",
    "owner"
] as const;

export type UserRole = (typeof USER_ROLES)[number];