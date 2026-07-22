<?php

namespace App\Notifications\Auth;

use Illuminate\Notifications\Messages\MailMessage;
use Rappasoft\LaravelAuthenticationLog\Notifications\FailedLogin as BaseFailedLogin;

class FailedLogin extends BaseFailedLogin
{
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('A failed login to your account'))
            ->markdown('emails.auths.failed', [
                'account' => $notifiable,
                'time' => $this->authenticationLog->login_at,
                'ipAddress' => $this->authenticationLog->ip_address,
                'browser' => $this->authenticationLog->user_agent,
                'location' => $this->authenticationLog->location,
            ]);
    }
}
