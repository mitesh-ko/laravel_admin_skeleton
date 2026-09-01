<?php

declare(strict_types=1);

namespace App\Notifications;

use App\DTOs\NotificationData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;

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
        return ['database', FcmChannel::class];
    }

    public function toArray(object $notifiable): array
    {
        return $this->data->toArray();
    }

    public function toFcm(object $notifiable): FcmMessage
    {
        return FcmMessage::create()
            ->data($this->data->toArray())
            ->notification(\NotificationChannels\Fcm\Resources\Notification::create()
                ->title($this->data->title)
                ->body($this->data->message));
    }
}
