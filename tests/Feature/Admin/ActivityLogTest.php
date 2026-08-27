<?php

use App\Enums\PermissionName;
use App\Models\Permission;
use App\Models\User;
use OwenIt\Auditing\Models\Audit;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_ACTIVITY_LOGS->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access activity logs list', function () {
    $response = $this->get(route('admin.activity-logs.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access activity logs list', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.activity-logs.index'));
    $response->assertForbidden();
});

test('authorized users can access activity logs list', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.activity-logs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/activity-logs/List'));
});

test('authorized users can search activity logs', function () {
    $this->actingAs($this->admin);

    Audit::create([
        'user_type' => User::class,
        'user_id' => $this->admin->id,
        'event' => 'created',
        'auditable_type' => User::class,
        'auditable_id' => 1,
        'old_values' => [],
        'new_values' => [],
        'url' => 'http://example.com',
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0',
    ]);

    $response = $this->getJson(route('admin.activity-logs.search'));

    $response->assertOk();
    $response->assertJsonStructure(['dataList', 'meta']);
});

test('authorized users can view specific activity log', function () {
    $this->actingAs($this->admin);

    $audit = Audit::create([
        'user_type' => User::class,
        'user_id' => $this->admin->id,
        'event' => 'updated',
        'auditable_type' => User::class,
        'auditable_id' => 1,
        'old_values' => [],
        'new_values' => [],
        'url' => 'http://example.com',
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0',
    ]);

    $response = $this->get(route('admin.activity-logs.show', $audit));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/activity-logs/View'));
});
