<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\PermissionName;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionName::VIEW_ROLES->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return $this->canManageRole($user, $role);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(PermissionName::CREATE_ROLES->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): bool
    {
        if (! $user->can(PermissionName::EDIT_ROLES->value)) {
            return false;
        }

        return $this->canManageRole($user, $role);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role): bool
    {
        if (! $user->can(PermissionName::DELETE_ROLES->value)) {
            return false;
        }

        return $this->canManageRole($user, $role);
    }

    /**
     * Determine whether the user can manage the given role based on ownership/all permissions.
     */
    private function canManageRole(User $user, Role $role): bool
    {
        if ($user->can(PermissionName::MANAGE_ALL_ROLES->value)) {
            return true;
        }

        return $user->can(PermissionName::MANAGE_OWN_ROLES->value) && $role->created_by === $user->id;
    }
}
