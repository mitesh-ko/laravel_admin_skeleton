<?php

namespace App\Mail;

use App\Models\User;
use App\Services\MailTemplateRendererService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\HtmlString;

class UserCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public User $user, public string $password)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $renderer = app(MailTemplateRendererService::class);
        $subject = $renderer->renderSubject('user_created', [
            'ACCOUNT_NAME' => $this->user->name,
            'EMAIL' => $this->user->email,
            'PASSWORD' => $this->password,
            'LOGIN_URL' => route('login'),
        ]);

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $renderer = app(MailTemplateRendererService::class);
        $html = $renderer->render('user_created', [
            'ACCOUNT_NAME' => $this->user->name,
            'EMAIL' => $this->user->email,
            'PASSWORD' => $this->password,
            'LOGIN_URL' => route('login'),
        ]);

        return new Content(
            markdown: 'emails.generic',
            with: [
                'html' => new HtmlString($html),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
