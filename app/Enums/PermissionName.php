<?php

declare(strict_types=1);

namespace App\Enums;

enum PermissionName: string
{
    /**
     * View the dashboard and access primary metrics.
     */
    case MANAGE_DASHBOARD = 'Manage Dashboard';

    // ---------------------------------------------------------
    // Users
    // ---------------------------------------------------------

    /**
     * General access to the Users module (e.g. view list, search).
     */
    case MANAGE_USERS = 'Manage Users';

    /**
     * Allows managing all users across the entire system regardless of ownership or scopes.
     */
    case MANAGE_ALL_USERS = 'Manage All Users';

    /**
     * Allows managing only the users created by or belonging to the authenticated user.
     */
    case MANAGE_OWN_USERS = 'Manage Own Users';

    /**
     * Create new user accounts.
     */
    case CREATE_USERS = 'Create Users';

    /**
     * Edit existing user accounts (name, email, roles, etc.).
     */
    case EDIT_USERS = 'Edit Users';

    /**
     * Delete user accounts.
     */
    case DELETE_USERS = 'Delete Users';

    /**
     * Change a user's active/inactive status.
     */
    case CHANGE_STATUS_USERS = 'Change Status Users';

    /**
     * Reset a user's password manually.
     */
    case RESET_PASSWORD_USERS = 'Reset Password Users';

    // ---------------------------------------------------------
    // Roles
    // ---------------------------------------------------------

    /**
     * General access to the Roles module (e.g. view list).
     */
    case MANAGE_ROLES = 'Manage Roles';

    /**
     * Allows managing all roles across the system.
     */
    case MANAGE_ALL_ROLES = 'Manage All Roles';

    /**
     * Allows managing only roles created by the authenticated user.
     */
    case MANAGE_OWN_ROLES = 'Manage Own Roles';

    /**
     * View detailed role information.
     */
    case VIEW_ROLES = 'View Roles';

    /**
     * Create new roles and assign permissions to them.
     */
    case CREATE_ROLES = 'Create Roles';

    /**
     * Edit existing roles (change name, update assigned permissions).
     */
    case EDIT_ROLES = 'Edit Roles';

    /**
     * Delete roles from the system.
     */
    case DELETE_ROLES = 'Delete Roles';

    // ---------------------------------------------------------
    // Activity Logs
    // ---------------------------------------------------------

    /**
     * Access and view the system's audit/activity logs.
     */
    case MANAGE_ACTIVITY_LOGS = 'Manage Activity Logs';

    /**
     * Access and view the system's authentication logs.
     */
    case MANAGE_AUTHENTICATION_LOGS = 'Manage Authentication Logs';

    // ---------------------------------------------------------
    // Mail Templates
    // ---------------------------------------------------------

    /**
     * Access and manage mail templates (edit email text, design, snippets).
     */
    case MANAGE_MAIL_TEMPLATES = 'Manage Mail Templates';

    // ---------------------------------------------------------
    // Settings
    // ---------------------------------------------------------

    /**
     * Access and manage global system settings.
     */
    case MANAGE_GENERAL_SETTINGS = 'Manage General Settings';
}
