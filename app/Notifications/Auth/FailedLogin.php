<?php

namespace App\Notifications\Auth;

use App\Services\MailTemplateRendererService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\HtmlString;
use Rappasoft\LaravelAuthenticationLog\Notifications\FailedLogin as BaseFailedLogin;

class FailedLogin extends BaseFailedLogin implements ShouldQueue
{
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

        $html = $renderer->render('auth_failed_login', $data);
        $subject = $renderer->renderSubject('auth_failed_login', $data);

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.generic', ['html' => new HtmlString($html)]);
    }
}
