<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;

class DeleteUserAction
{
    public function execute(User $user): bool
    {
        if ($user->assignedUsers()->exists()) {
            throw new \Exception('Cannot delete user because they are actively managing other users. Please reassign their subordinates first.');
        }

        return $user->delete();
    }
}
