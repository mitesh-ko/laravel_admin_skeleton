<?php

declare(strict_types=1);

namespace App\Facades;

use App\Services\MediaService;
use Illuminate\Support\Facades\Facade;

/**
 * @method static \Spatie\MediaLibrary\MediaCollections\Models\Media upload(\Illuminate\Database\Eloquent\Model $model, \Illuminate\Http\UploadedFile $file, string $collection = 'default')
 * @method static void deleteSpecificMedia(\Spatie\MediaLibrary\MediaCollections\Models\Media $media)
 * @method static void deleteAllMedia(\Illuminate\Database\Eloquent\Model $model, ?string $collection = null)
 *
 * @see MediaService
 */
class MediaManager extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return MediaService::class;
    }
}
