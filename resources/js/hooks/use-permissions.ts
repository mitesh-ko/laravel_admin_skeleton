import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const permissions = usePage().props.auth.permissions;

    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };

    const hasAnyPermission = (permissionsToCheck: string[]) => {
        return permissionsToCheck.some((p) => permissions.includes(p));
    };

    const hasAllPermissions = (permissionsToCheck: string[]) => {
        return permissionsToCheck.every((p) => permissions.includes(p));
    };

    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
}
