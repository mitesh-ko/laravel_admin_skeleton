<?php

namespace App\Notifications\Auth;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\Notification;
use Rappasoft\LaravelAuthenticationLog\Notifications\SuspiciousActivity as BaseSuspiciousActivity;

class SuspiciousActivity extends BaseSuspiciousActivity implements ShouldQueue
{
    public function via($notifiable)
    {
        return ['mail', FcmChannel::class];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('Suspicious activity detected on your :app account', ['app' => config('app.name')]))
            ->markdown('emails.auths.suspicious', [
                'account' => $notifiable,
                'time' => $this->authenticationLog->login_at,
                'ipAddress' => $this->authenticationLog->ip_address,
                'browser' => $this->authenticationLog->user_agent,
                'location' => $this->authenticationLog->location,
                'suspiciousActivities' => $this->suspiciousActivities,
            ]);
    }

    public function toFcm($notifiable): FcmMessage
    {
        return FcmMessage::create()
            ->notification(Notification::create()
                ->title('Suspicious Activity Detected')
                ->body('We detected suspicious activity on your account.'));
    }
}
