<?php

namespace App\Notifications\Auth;

use App\Services\MailTemplateRendererService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\HtmlString;
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\Notification;
use Rappasoft\LaravelAuthenticationLog\Notifications\NewDevice as BaseNewDevice;

class NewDevice extends BaseNewDevice implements ShouldQueue
{
    public function via($notifiable)
    {
        return ['mail', FcmChannel::class];
    }

    public function toMail($notifiable)
    {
        $renderer = app(MailTemplateRendererService::class);
        $data = [
            'ACCOUNT_NAME' => $notifiable->name ?? $notifiable->email,
            'TIME' => $this->authenticationLog->login_at->toDateTimeString(),
            'IP_ADDRESS' => $this->authenticationLog->ip_address,
            'BROWSER' => $this->authenticationLog->user_agent,
            'LOCATION' => $this->authenticationLog->location && $this->authenticationLog->location['default'] === false
                ? ($this->authenticationLog->location['city'] ?? 'N/A').', '.($this->authenticationLog->location['state'] ?? 'N/A')
                : 'Unknown',
        ];

        $html = $renderer->render('auth_new_device', $data);
        $subject = $renderer->renderSubject('auth_new_device', $data);

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.generic', ['html' => new HtmlString($html)]);
    }

    public function toFcm($notifiable): FcmMessage
    {
        return FcmMessage::create()
            ->notification(Notification::create()
                ->title('New Device Login')
                ->body('Your account was logged into from a new device.'));
    }
}
