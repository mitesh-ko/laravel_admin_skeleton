<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\FileExport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanFileExportsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exports:clean {--days=1 : The number of days to retain the exports}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old file exports and their associated files';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');

        $oldExports = FileExport::where('created_at', '<', now()->subDays($days))->get();

        if ($oldExports->isEmpty()) {
            $this->info('No old exports to clean.');

            return self::SUCCESS;
        }

        $count = 0;

        foreach ($oldExports as $export) {
            if ($export->file_path && Storage::exists($export->file_path)) {
                Storage::delete($export->file_path);
            }
            $export->delete();
            $count++;
        }

        $this->info("Successfully cleaned up {$count} old export(s).");

        return self::SUCCESS;
    }
}
