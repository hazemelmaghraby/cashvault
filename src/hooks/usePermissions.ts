import { useAuth } from "../context/AuthContext";
import { ROLE_PERMISSIONS } from "../constants/permissions";

import type { Permission } from "../constants/permissions";

export const usePermissions = () => {
    const { profile } = useAuth();

    const can = (permission: Permission): boolean => {
        if (!profile) {
            return false;
        }

        const permissions =
            ROLE_PERMISSIONS[profile.role];

        return permissions.includes(permission);
    };

    return {
        can,
    };
};
