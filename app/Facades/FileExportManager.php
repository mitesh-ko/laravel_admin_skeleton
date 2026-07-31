<?php

declare(strict_types=1);

namespace App\Facades;

use App\Services\FileExportService;
use Illuminate\Support\Facades\Facade;

/**
 * @method static \App\Models\FileExport initiate(\App\DTOs\FileExportDTO $dto)
 * @method static void markAsProcessing(\App\Models\FileExport|string $export)
 * @method static void markAsCompleted(\App\Models\FileExport|string $export, string $filePath)
 * @method static void markAsFailed(\App\Models\FileExport|string $export, string $errorMessage)
 *
 * @see FileExportService
 */
class FileExportManager extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return FileExportService::class;
    }
}
