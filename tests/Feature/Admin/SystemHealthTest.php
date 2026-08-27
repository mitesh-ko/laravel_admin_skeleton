<?php

use App\Enums\PermissionName;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_SYSTEM_HEALTH->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access system health page', function () {
    $response = $this->get(route('admin.system-health.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access system health page', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.system-health.index'));
    $response->assertForbidden();
});

test('authorized users can access system health page', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.system-health.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/system-health/Index'));
});

test('authorized users can access system logs', function () {
    $this->actingAs($this->admin);

    // Create a dummy log file
    $logPath = storage_path('logs/laravel.log');
    if (! File::exists(dirname($logPath))) {
        File::makeDirectory(dirname($logPath), 0755, true);
    }
    File::put($logPath, "Test log content\n");

    $response = $this->getJson(route('admin.system-health.logs'));

    $response->assertOk();
    $response->assertJsonStructure(['log']);

    // Clean up
    File::delete($logPath);
});

test('authorized users can clear cache', function () {
    Artisan::spy();
    $this->actingAs($this->admin);

    $response = $this->post(route('admin.system-health.clear-cache'));

    $response->assertRedirect();
    Artisan::shouldHaveReceived('call')->with('optimize:clear');
});
