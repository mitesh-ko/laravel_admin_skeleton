<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('mail.mail_mailer', env('MAIL_MAILER', 'log'));
        $this->migrator->add('mail.mail_host', env('MAIL_HOST', '127.0.0.1'));
        $this->migrator->add('mail.mail_port', (int) env('MAIL_PORT', 2525));
        $this->migrator->add('mail.mail_username', env('MAIL_USERNAME', ''));
        $this->migrator->add('mail.mail_password', env('MAIL_PASSWORD', ''));
        $this->migrator->add('mail.mail_encryption', env('MAIL_ENCRYPTION', 'tls'));
        $this->migrator->add('mail.mail_from_address', env('MAIL_FROM_ADDRESS', 'hello@example.com'));
        $this->migrator->add('mail.mail_from_name', env('MAIL_FROM_NAME', 'Throtik'));
    }
};
