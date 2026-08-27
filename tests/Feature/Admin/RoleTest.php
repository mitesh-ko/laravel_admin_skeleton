<?php

use App\Enums\PermissionName;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_ROLES->value]),
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_ALL_ROLES->value]),
        Permission::firstOrCreate(['name' => PermissionName::CREATE_ROLES->value]),
        Permission::firstOrCreate(['name' => PermissionName::EDIT_ROLES->value]),
        Permission::firstOrCreate(['name' => PermissionName::DELETE_ROLES->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access roles list', function () {
    $response = $this->get(route('admin.roles.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access roles list', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.roles.index'));
    $response->assertForbidden();
});

test('authorized users can access roles list', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.roles.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/roles/List'));
});

test('authorized users can search roles', function () {
    $this->actingAs($this->admin);
    Role::create(['name' => 'Test Role 1']);
    Role::create(['name' => 'Test Role 2']);

    $response = $this->getJson(route('admin.roles.search'));

    $response->assertOk();
    $response->assertJsonStructure(['dataList', 'meta']);
});

test('authorized users can view create role page', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.roles.create'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/roles/CreateEdit'));
});

test('authorized users can store a new role', function () {
    $this->actingAs($this->admin);

    $roleData = [
        'name' => 'New Role',
        'permissions' => [$this->permissions[0]->name],
    ];

    $response = $this->post(route('admin.roles.store'), $roleData);

    $response->assertRedirect(route('admin.roles.index'));
    $this->assertDatabaseHas('roles', [
        'name' => 'New Role',
    ]);
});

test('authorized users can view edit role page', function () {
    $this->actingAs($this->admin);
    $role = Role::create(['name' => 'Edit Me Role']);

    $response = $this->get(route('admin.roles.edit', $role));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/roles/CreateEdit'));
});

test('authorized users can update an existing role', function () {
    $this->actingAs($this->admin);
    $role = Role::create(['name' => 'Old Role Name']);

    $updateData = [
        'name' => 'Updated Role Name',
        'permissions' => [],
    ];

    $response = $this->put(route('admin.roles.update', $role), $updateData);

    $response->assertRedirect(route('admin.roles.index'));
    $this->assertDatabaseHas('roles', [
        'id' => $role->id,
        'name' => 'Updated Role Name',
    ]);
});

test('authorized users can delete a role', function () {
    $this->actingAs($this->admin);
    $role = Role::create(['name' => 'Delete Me Role']);

    $response = $this->delete(route('admin.roles.destroy', $role));

    $response->assertRedirect(route('admin.roles.index'));
    $this->assertDatabaseMissing('roles', [
        'id' => $role->id,
    ]);
});
