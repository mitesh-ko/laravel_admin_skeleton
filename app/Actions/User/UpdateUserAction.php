<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\UserData;
use App\Models\User;

class UpdateUserAction
{
    public function execute(User $user, UserData $data): User
    {
        $user->update([
            'name' => $data->name,
            'email' => $data->email,
        ]);

        $user->syncRoles($data->roles);

        return $user;
    }
}
