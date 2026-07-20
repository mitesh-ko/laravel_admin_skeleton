<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\PermissionName;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionName::VIEW_USERS->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        if (! $user->can(PermissionName::MANAGE_USERS->value)) {
            return false;
        }

        return $this->canManageUser($user, $model);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(PermissionName::CREATE_USERS->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        if (! $user->can(PermissionName::EDIT_USERS->value)) {
            return false;
        }

        return $this->canManageUser($user, $model);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        if (! $user->can(PermissionName::DELETE_USERS->value)) {
            return false;
        }

        return $this->canManageUser($user, $model);
    }

    /**
     * Determine whether the user can manage the given user based on ownership/all permissions.
     */
    private function canManageUser(User $user, User $model): bool
    {
        if ($user->can(PermissionName::MANAGE_ALL_USERS->value)) {
            return true;
        }

        return $user->can(PermissionName::MANAGE_OWN_USERS->value) && $model->assigned_to === $user->id;
    }
}
