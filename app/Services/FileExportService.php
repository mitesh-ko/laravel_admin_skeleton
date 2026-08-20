<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\FileExportDTO;
use App\DTOs\NotificationData;
use App\Models\FileExport;
use App\Notifications\AppNotification;

class FileExportService
{
    /**
     * Start a new export record.
     */
    public function initiate(FileExportDTO $dto): FileExport
    {
        return FileExport::create([
            'user_id' => $dto->userId,
            'name' => $dto->name,
            'details' => $dto->details,
            'status' => 'pending',
        ]);
    }

    /**
     * Mark export as processing.
     */
    public function markAsProcessing(FileExport|string $export): void
    {
        $export = $export instanceof FileExport ? $export : FileExport::findOrFail($export);

        $export->update(['status' => 'processing']);
    }

    /**
     * Mark export as completed and store the file path.
     */
    public function markAsCompleted(FileExport|string $export, string $filePath): void
    {
        $export = $export instanceof FileExport ? $export : FileExport::findOrFail($export);

        $export->update([
            'status' => 'completed',
            'file_path' => $filePath,
            'completed_at' => now(),
        ]);

        $export->user?->notify(
            new AppNotification(
                NotificationData::make(
                    title: 'Export Completed',
                    message: "Your export '{$export->name}' is ready to download.",
                    actionLabel: 'Download',
                    actionUrl: route('admin.file-exports.download', $export->id),
                )
            )
        );
    }

    /**
     * Mark export as failed.
     */
    public function markAsFailed(FileExport|string $export, string $errorMessage): void
    {
        $export = $export instanceof FileExport ? $export : FileExport::findOrFail($export);

        $export->update([
            'status' => 'failed',
            'error_message' => $errorMessage,
        ]);
    }
}
