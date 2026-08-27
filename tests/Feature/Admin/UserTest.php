<?php

use App\Enums\PermissionName;
use App\Jobs\ExportUsersJob;
use App\Models\Permission;
use App\Models\User;
use Database\Seeders\MailTemplateSeeder;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    $this->seed(MailTemplateSeeder::class);

    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_USERS->value]),
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_ALL_USERS->value]),
        Permission::firstOrCreate(['name' => PermissionName::CREATE_USERS->value]),
        Permission::firstOrCreate(['name' => PermissionName::EDIT_USERS->value]),
        Permission::firstOrCreate(['name' => PermissionName::DELETE_USERS->value]),
        Permission::firstOrCreate(['name' => PermissionName::EXPORT_USERS->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access users list', function () {
    $response = $this->get(route('admin.users.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access users list', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.users.index'));
    $response->assertForbidden();
});

test('authorized users can access users list', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.users.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/users/List'));
});

test('authorized users can search users', function () {
    $this->actingAs($this->admin);
    User::factory()->count(3)->create();

    $response = $this->getJson(route('admin.users.search'));

    $response->assertOk();
    $response->assertJsonStructure(['dataList', 'meta']);
});

test('authorized users can view create user page', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.users.create'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/users/CreateEdit'));
});

test('authorized users can store a new user', function () {
    $this->actingAs($this->admin);

    $userData = [
        'name' => 'Test User',
        'email' => 'testuser@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'roles' => [],
        'permissions' => [],
    ];

    $response = $this->post(route('admin.users.store'), $userData);

    $response->assertRedirect(route('admin.users.index'));
    $this->assertDatabaseHas('users', [
        'email' => 'testuser@example.com',
        'name' => 'Test User',
    ]);
});

test('authorized users can view edit user page', function () {
    $this->actingAs($this->admin);
    $user = User::factory()->create();

    $response = $this->get(route('admin.users.edit', $user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/users/CreateEdit'));
});

test('authorized users can update an existing user', function () {
    $this->actingAs($this->admin);
    $user = User::factory()->create();

    $updateData = [
        'name' => 'Updated Name',
        'email' => $user->email,
        'roles' => [],
        'permissions' => [],
    ];

    $response = $this->put(route('admin.users.update', $user), $updateData);

    $response->assertRedirect(route('admin.users.index'));
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);
});

test('authorized users can delete a user', function () {
    $this->actingAs($this->admin);
    $user = User::factory()->create();

    $response = $this->delete(route('admin.users.destroy', $user));

    $response->assertRedirect(route('admin.users.index'));
    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

test('authorized users can export users', function () {
    Queue::fake();
    $this->actingAs($this->admin);

    $response = $this->post(route('admin.users.export'));

    $response->assertRedirect();
    Queue::assertPushed(ExportUsersJob::class);
});
