<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanNotificationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:clean {--days=30 : The number of days to retain notifications}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up notifications older than the specified number of days';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');

        $deletedCount = DB::table('notifications')
            ->where('created_at', '<', now()->subDays($days))
            ->delete();

        if ($deletedCount === 0) {
            $this->info('No old notifications to clean.');

            return self::SUCCESS;
        }

        $this->info("Successfully cleaned up {$deletedCount} old notification(s).");

        return self::SUCCESS;
    }
}
