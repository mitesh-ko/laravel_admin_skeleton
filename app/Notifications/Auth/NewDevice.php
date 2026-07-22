<?php

namespace App\Notifications\Auth;

use Illuminate\Notifications\Messages\MailMessage;
use Rappasoft\LaravelAuthenticationLog\Notifications\NewDevice as BaseNewDevice;

class NewDevice extends BaseNewDevice
{
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('Your :app account logged in from a new device.', ['app' => config('app.name')]))
            ->markdown('emails.auths.new', [
                'account' => $notifiable,
                'time' => $this->authenticationLog->login_at,
                'ipAddress' => $this->authenticationLog->ip_address,
                'browser' => $this->authenticationLog->user_agent,
                'location' => $this->authenticationLog->location,
            ]);
    }
}
