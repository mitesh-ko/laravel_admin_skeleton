<?php

use App\Enums\PermissionName;
use App\Models\Permission;
use App\Models\User;
use Rappasoft\LaravelAuthenticationLog\Models\AuthenticationLog;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_AUTHENTICATION_LOGS->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access authentication logs list', function () {
    $response = $this->get(route('admin.authentication-logs.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access authentication logs list', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.authentication-logs.index'));
    $response->assertForbidden();
});

test('authorized users can access authentication logs list', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.authentication-logs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/authentication-logs/List'));
});

test('authorized users can search authentication logs', function () {
    $this->actingAs($this->admin);

    $log = new AuthenticationLog([
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0',
        'login_at' => now(),
    ]);
    $log->authenticatable()->associate($this->admin);
    $log->save();

    $response = $this->getJson(route('admin.authentication-logs.search'));

    $response->assertOk();
    $response->assertJsonStructure(['dataList', 'meta']);
});
