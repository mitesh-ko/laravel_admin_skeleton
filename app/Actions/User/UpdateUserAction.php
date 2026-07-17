<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\UserDTO;
use App\Models\User;

class UpdateUserAction
{
    public function execute(User $user, UserDTO $data): User
    {
        $user->update([
            'name' => $data->name,
            'email' => $data->email,
        ]);

        // Update assigned users (Top-Down)
        User::where('assigned_to', $user->id)->update(['assigned_to' => null]);

        if (! empty($data->assigned_users)) {
            User::whereIn('id', $data->assigned_users)->update(['assigned_to' => $user->id]);
        }

        $user->syncRoles($data->roles);
        $user->syncPermissions($data->permissions);

        return $user;
    }
}
