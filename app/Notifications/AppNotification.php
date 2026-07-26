<?php

declare(strict_types=1);

namespace App\Notifications;

use App\DTOs\NotificationData;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class AppNotification extends Notification
{
    use Queueable;

    /** Override default UUID with ULID for consistency with the rest of the app. */
    public string $id;

    public function __construct(
        private readonly NotificationData $data,
    ) {
        $this->id = (string) Str::ulid();
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return $this->data->toArray();
    }
}
