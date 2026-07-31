<?php

namespace App\Notifications\Auth;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Rappasoft\LaravelAuthenticationLog\Notifications\SuspiciousActivity as BaseSuspiciousActivity;

class SuspiciousActivity extends BaseSuspiciousActivity implements ShouldQueue
{
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
}
