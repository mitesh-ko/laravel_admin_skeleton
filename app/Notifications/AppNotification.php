<?php

declare(strict_types=1);

namespace App\Notifications;

use App\DTOs\NotificationData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class AppNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /** Override default UUID with ULID for consistency with the rest of the app. */
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
