<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\DTOs\NotificationData;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@throtik.com')->first();

        if (! $admin) {
            $this->command->warn('No users found. Please run UserSeeder first.');

            return;
        }

        /** @var NotificationService $notify */
        $notify = app('notify');

        $notifications = [
            NotificationData::make(
                title: '👤 New User Registered',
                message: 'A new user "John Doe" has just created an account and is awaiting verification.',
                actionLabel: 'View User',
                actionUrl: route('admin.users.index'),
            ),
            NotificationData::make(
                title: '🔐 Failed Login Attempt',
                message: 'There were 3 consecutive failed login attempts from IP 192.168.1.105.',
            ),
            NotificationData::make(
                title: '⚙️ System Update Available',
                message: 'A new system update (v2.5.0) is available. Schedule a maintenance window to apply it.',
            ),
            NotificationData::make(
                title: '📊 Monthly Report Ready',
                message: 'Your analytics report for June 2026 has been generated and is ready to download.',
                actionLabel: 'View Dashboard',
                actionUrl: route('dashboard'),
            ),
            NotificationData::make(
                title: '🚨 Low Disk Space Warning',
                message: 'Server disk usage has reached 85%. Consider freeing up space or expanding storage.',
            ),
            NotificationData::make(
                title: '📋 Pending Approval Request',
                message: 'User "Jane Smith" has submitted a profile update that requires your review and approval.',
                actionLabel: 'Review Request',
                actionUrl: route('admin.users.index'),
            ),
            NotificationData::make(
                title: '🔑 New API Key Generated',
                message: 'A new API key was generated for the integration "Stripe Webhooks". Review if this was not you.',
            ),
            NotificationData::make(
                title: '📧 Mail Queue Backup',
                message: 'The mail queue has over 500 pending jobs. Check the queue worker status.',
                actionLabel: 'View Settings',
                actionUrl: route('admin.settings.edit-general'),
            ),
            NotificationData::make(
                title: '🎯 UTM Campaign Spike',
                message: 'Campaign "Summer Sale 2026" has received 200% more visits than usual in the last hour.',
                actionLabel: 'View Dashboard',
                actionUrl: route('dashboard'),
            ),
            NotificationData::make(
                title: '✅ Backup Completed Successfully',
                message: 'The daily database backup completed successfully at 03:00 AM. Size: 1.2 GB.',
            ),
        ];

        foreach ($notifications as $data) {
            $notify->send($admin, $data);
        }

        $this->command->info('Created 10 system notifications for admin user.');
    }
}
