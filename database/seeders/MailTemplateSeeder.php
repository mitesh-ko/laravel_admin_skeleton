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
        MailTemplate::firstOrCreate(
            ['key' => 'user_created'],
            [
                'subject' => 'Welcome to our platform - Your Account Details',
                'html_content' => '<p># Welcome, {ACCOUNT_NAME}!</p><p>An account has been created for you on our platform.</p><p>Your login details are as follows:</p><ul><li><strong>Email:</strong> {EMAIL}</li><li><strong>Password:</strong> {PASSWORD}</li></ul><p>Please log in and change your password as soon as possible.</p><p><a href="{LOGIN_URL}">Log In</a></p>',
                'available_snippets' => [
                    'ACCOUNT_NAME',
                    'EMAIL',
                    'PASSWORD',
                    'LOGIN_URL',
                ],
            ]
        );
    }
}
