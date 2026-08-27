<?php

use App\Enums\PermissionName;
use App\Models\Permission;
use App\Models\User;
use App\Settings\GeneralSettings;
use App\Settings\MailSettings;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_GENERAL_SETTINGS->value]),
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_MAIL_SETTINGS->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access general settings', function () {
    $response = $this->get(route('admin.settings.edit-general'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access general settings', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.settings.edit-general'));
    $response->assertForbidden();
});

test('authorized users can access general settings', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.settings.edit-general'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/settings/General'));
});

test('authorized users can update general settings', function () {
    $this->actingAs($this->admin);

    $updateData = [
        'site_name' => 'New Awesome Site Name',
        'site_active' => true,
        'support_email' => 'support@example.com',
    ];

    $response = $this->put(route('admin.settings.update-general'), $updateData);

    $response->assertRedirect();

    $settings = app(GeneralSettings::class);
    $this->assertEquals('New Awesome Site Name', $settings->site_name);
    $this->assertTrue($settings->site_active);
    $this->assertEquals('support@example.com', $settings->support_email);
});

test('guests cannot access mail settings', function () {
    $response = $this->get(route('admin.settings.edit-mail'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access mail settings', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.settings.edit-mail'));
    $response->assertForbidden();
});

test('authorized users can access mail settings', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.settings.edit-mail'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/settings/Mail'));
});

test('authorized users can update mail settings', function () {
    $this->actingAs($this->admin);

    $updateData = [
        'mail_mailer' => 'smtp',
        'mail_host' => 'mailhog',
        'mail_port' => 1025,
        'mail_username' => 'user',
        'mail_password' => 'password',
        'mail_encryption' => 'tls',
        'mail_from_address' => 'hello@example.com',
        'mail_from_name' => 'Example',
    ];

    $response = $this->put(route('admin.settings.update-mail'), $updateData);

    $response->assertRedirect();

    $settings = app(MailSettings::class);
    $this->assertEquals('smtp', $settings->mail_mailer);
    $this->assertEquals('mailhog', $settings->mail_host);
    $this->assertEquals('hello@example.com', $settings->mail_from_address);
});
