<?php

use App\Enums\PermissionName;
use App\Models\FileExport;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::EXPORT_USERS->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access file exports list', function () {
    $response = $this->get(route('admin.file-exports.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access file exports list', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.file-exports.index'));
    $response->assertForbidden();
});

test('authorized users can access file exports list', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.file-exports.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/file-exports/Index'));
});

test('authorized users can search file exports', function () {
    $this->actingAs($this->admin);

    FileExport::create([
        'user_id' => $this->admin->id,
        'name' => 'Users Export',
        'status' => 'completed',
        'file_path' => 'exports/users.csv',
    ]);

    $response = $this->getJson(route('admin.file-exports.search'));

    $response->assertOk();
    $response->assertJsonStructure(['dataList', 'meta']);
});

test('users can only download their own exports', function () {
    $otherUser = User::factory()->create();
    $this->actingAs($otherUser);

    $export = FileExport::create([
        'user_id' => $this->admin->id,
        'name' => 'Users Export',
        'status' => 'completed',
        'file_path' => 'exports/users.csv',
    ]);

    $response = $this->get(route('admin.file-exports.download', $export));
    $response->assertForbidden();
});

test('authorized users can download their exports', function () {
    $this->actingAs($this->admin);

    Storage::fake('local');
    Storage::disk('local')->put('exports/test.csv', 'id,name,email');

    $export = FileExport::create([
        'user_id' => $this->admin->id,
        'name' => 'Test Export',
        'status' => 'completed',
        'file_path' => 'exports/test.csv',
    ]);

    $response = $this->get(route('admin.file-exports.download', $export));

    $response->assertOk();
    $response->assertDownload();
});
