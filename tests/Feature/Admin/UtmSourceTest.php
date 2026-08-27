<?php

use App\Enums\PermissionName;
use App\Models\Permission;
use App\Models\User;
use App\Models\UtmSource;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_UTM_SOURCES->value]),
        Permission::firstOrCreate(['name' => PermissionName::CREATE_UTM_SOURCES->value]),
        Permission::firstOrCreate(['name' => PermissionName::EDIT_UTM_SOURCES->value]),
        Permission::firstOrCreate(['name' => PermissionName::DELETE_UTM_SOURCES->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access utm sources list', function () {
    $response = $this->get(route('admin.utm-sources.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access utm sources list', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.utm-sources.index'));
    $response->assertForbidden();
});

test('authorized users can access utm sources list', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.utm-sources.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/utm-sources/List'));
});

test('authorized users can access utm source create page', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.utm-sources.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/utm-sources/CreateEdit'));
});

test('authorized users can store utm source', function () {
    $this->actingAs($this->admin);

    $data = [
        'name' => 'Facebook Campaign',
        'code' => 'facebook',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'summer_sale',
        'is_active' => true,
    ];

    $response = $this->post(route('admin.utm-sources.store'), $data);

    $response->assertRedirect(route('admin.utm-sources.index'));
    $this->assertDatabaseHas('utm_sources', [
        'code' => 'facebook',
    ]);
});

test('authorized users can access utm source edit page', function () {
    $this->actingAs($this->admin);

    $utmSource = UtmSource::create([
        'name' => 'Old Name',
        'code' => 'old_code',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'old',
    ]);

    $response = $this->get(route('admin.utm-sources.edit', $utmSource));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/utm-sources/CreateEdit'));
});

test('authorized users can update utm source', function () {
    $this->actingAs($this->admin);

    $utmSource = UtmSource::create([
        'name' => 'Old Name',
        'code' => 'old_code',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'old',
    ]);

    $data = [
        'name' => 'New Name',
        'code' => 'new_code',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'summer_sale',
        'is_active' => true,
    ];

    $response = $this->put(route('admin.utm-sources.update', $utmSource), $data);

    $response->assertRedirect(route('admin.utm-sources.index'));
    $this->assertDatabaseHas('utm_sources', [
        'id' => $utmSource->id,
        'name' => 'New Name',
        'code' => 'new_code',
    ]);
});

test('authorized users can delete utm source', function () {
    $this->actingAs($this->admin);

    $utmSource = UtmSource::create([
        'name' => 'Old Name',
        'code' => 'old_code',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'old',
    ]);

    $response = $this->delete(route('admin.utm-sources.destroy', $utmSource));

    $response->assertRedirect(route('admin.utm-sources.index'));
    $this->assertDatabaseMissing('utm_sources', [
        'id' => $utmSource->id,
    ]);
});
