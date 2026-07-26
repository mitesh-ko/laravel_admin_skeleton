<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\NotificationData;
use App\Models\User;
use App\Notifications\AppNotification;
use InvalidArgumentException;

class NotificationService
{
    /**
     * Send a notification to a specific user.
     */
    public function send(User $user, NotificationData $data): void
    {
        $user->notify(new AppNotification($data));
    }

    /**
     * Send the same notification to multiple users.
     *
     * @param  User[]  $users
     */
    public function sendToMany(array $users, NotificationData $data): void
    {
        foreach ($users as $user) {
            if (! $user instanceof User) {
                throw new InvalidArgumentException('Expected an instance of User, got '.get_class($user));
            }

            $this->send($user, $data);
        }
    }

    /**
     * Send a notification to all users with a given role.
     */
    public function sendToRole(string $role, NotificationData $data): void
    {
        $users = User::role($role)->get();

        $this->sendToMany($users->all(), $data);
    }
}
