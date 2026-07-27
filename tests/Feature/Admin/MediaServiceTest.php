<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Facades\MediaManager;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_upload_media_to_model(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg');

        $media = MediaManager::upload($user, $file, 'avatars');

        $this->assertDatabaseHas('media', [
            'id' => $media->id,
            'model_type' => User::class,
            'model_id' => $user->id,
            'collection_name' => 'avatars',
            'file_name' => 'avatar.jpg',
        ]);
    }

    public function test_it_can_delete_specific_media(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg');

        $media = MediaManager::upload($user, $file, 'avatars');

        $this->assertDatabaseHas('media', [
            'id' => $media->id,
        ]);

        MediaManager::deleteSpecificMedia($media);

        $this->assertDatabaseMissing('media', [
            'id' => $media->id,
        ]);
    }

    public function test_it_can_delete_all_media_for_a_model(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $file1 = UploadedFile::fake()->image('avatar1.jpg');
        $file2 = UploadedFile::fake()->image('avatar2.jpg');

        MediaManager::upload($user, $file1, 'avatars');
        MediaManager::upload($user, $file2, 'documents');

        $this->assertEquals(2, $user->getMedia('*')->count());

        // Test clearing specific collection
        MediaManager::deleteAllMedia($user, 'documents');
        $user->load('media'); // Refresh relation
        $this->assertEquals(1, $user->getMedia('*')->count());

        // Test clearing all
        MediaManager::deleteAllMedia($user);
        $user->load('media'); // Refresh relation
        $this->assertEquals(0, $user->getMedia('*')->count());
    }
}
