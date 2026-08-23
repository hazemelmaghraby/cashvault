import type { UserRole } from "../../../constants/types/RoleTypes";

export type UserStatus = "active" | "suspended" | "disabled";

export interface UserProfile {
    uid: string;

    firstName: string;
    lastName: string;
    email: string;

    role: UserRole;
    status: UserStatus;
    currency?: string;

    createdAt?: unknown;
    updatedAt?: unknown;
};