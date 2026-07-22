<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\MailTemplate;
use Illuminate\Database\Seeder;

class MailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        MailTemplate::firstOrCreate(
            ['key' => 'auth_new_device'],
            [
                'subject' => 'Your account logged in from a new device',
                'html_content' => '<p>Hello <strong>{ACCOUNT_NAME}</strong>,</p><p>Your account was logged into from a new device.</p><p><strong>Time:</strong> {TIME}</p><p><strong>IP Address:</strong> {IP_ADDRESS}</p><p><strong>Browser:</strong> {BROWSER}</p><p><strong>Location:</strong> {LOCATION}</p><p>If this was you, you can ignore this email. If this was not you, please change your password immediately.</p>',
                'available_snippets' => [
                    'ACCOUNT_NAME',
                    'TIME',
                    'IP_ADDRESS',
                    'BROWSER',
                    'LOCATION',
                ],
            ]
        );

        MailTemplate::firstOrCreate(
            ['key' => 'auth_failed_login'],
            [
                'subject' => 'A failed login to your account',
                'html_content' => '<p>Hello <strong>{ACCOUNT_NAME}</strong>,</p><p>There has been a failed login attempt to your account.</p><p><strong>Time:</strong> {TIME}</p><p><strong>IP Address:</strong> {IP_ADDRESS}</p><p><strong>Browser:</strong> {BROWSER}</p><p><strong>Location:</strong> {LOCATION}</p>',
                'available_snippets' => [
                    'ACCOUNT_NAME',
                    'TIME',
                    'IP_ADDRESS',
                    'BROWSER',
                    'LOCATION',
                ],
            ]
        );
    }
}
