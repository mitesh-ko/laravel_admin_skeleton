<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Facades\FileExportManager;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ExportUsersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly string $fileExportId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            FileExportManager::markAsProcessing($this->fileExportId);

            $filename = 'exports/users/users_'.now()->format('Ymd_His').'_'.uniqid().'.csv';

            // Ensure directory exists
            if (! Storage::exists('exports/users')) {
                Storage::makeDirectory('exports/users');
            }

            $path = Storage::path($filename);

            $file = fopen($path, 'w');

            // Write BOM for Excel UTF-8 compatibility
            fwrite($file, $bom = (chr(0xEF).chr(0xBB).chr(0xBF)));

            // Write headers
            fputcsv($file, [
                'ID',
                'Name',
                'Email',
                'Joined On',
            ]);

            $dateFormat = strtr(config('services.admin_date_time'), [
                'dd' => 'd',
                'MMM' => 'M',
                'yyyy' => 'Y',
                'HH' => 'H',
                'MM' => 'i',
            ]);

            // Chunk users to save memory
            User::chunk(500, function ($users) use ($file, $dateFormat) {
                foreach ($users as $user) {
                    fputcsv($file, [
                        $user->id,
                        $user->name,
                        $user->email,
                        $user->created_at ? $user->created_at->format($dateFormat) : '',
                    ]);
                }
            });

            fclose($file);

            FileExportManager::markAsCompleted($this->fileExportId, $filename);
        } catch (\Throwable $th) {
            FileExportManager::markAsFailed($this->fileExportId, $th->getMessage());
        }
    }
}
