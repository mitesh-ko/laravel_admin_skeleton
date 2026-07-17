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

        $user->syncRoles($data->roles);
        $user->syncPermissions($data->permissions);

        return $user;
    }
}
