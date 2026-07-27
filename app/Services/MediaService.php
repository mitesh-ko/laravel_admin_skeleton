<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaService
{
    /**
     * Upload and attach a file to a given model.
     *
     * @param  Model&HasMedia  $model  The model to attach the file to.
     * @param  UploadedFile  $file  The uploaded file.
     * @param  string  $collection  The media collection name.
     */
    public function upload(Model $model, UploadedFile $file, string $collection = 'default'): Media
    {
        return $model->addMedia($file)->toMediaCollection($collection);
    }

    /**
     * Delete a specific media file.
     *
     * @param  Media  $media  The media instance to delete.
     */
    public function deleteSpecificMedia(Media $media): void
    {
        $media->delete();
    }

    /**
     * Delete all media associated with a model.
     * Optionally specify a collection to only clear that collection.
     *
     * @param  Model&HasMedia  $model
     */
    public function deleteAllMedia(Model $model, ?string $collection = null): void
    {
        if ($collection) {
            $model->clearMediaCollection($collection);
        } else {
            // Retrieve and delete each to trigger model events and clear files
            $model->media->each->delete();
        }
    }
}
