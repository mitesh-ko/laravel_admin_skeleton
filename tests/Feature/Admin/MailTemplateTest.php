<?php

use App\Enums\PermissionName;
use App\Models\MailTemplate;
use App\Models\Permission;
use App\Models\User;

beforeEach(function () {
    $this->permissions = [
        Permission::firstOrCreate(['name' => PermissionName::MANAGE_MAIL_TEMPLATES->value]),
    ];

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo($this->permissions);
});

test('guests cannot access mail templates list', function () {
    $response = $this->get(route('admin.mail-templates.index'));
    $response->assertRedirect(route('login'));
});

test('unauthorized users cannot access mail templates list', function () {
    $unauthorizedUser = User::factory()->create();
    $this->actingAs($unauthorizedUser);

    $response = $this->get(route('admin.mail-templates.index'));
    $response->assertForbidden();
});

test('authorized users can access mail templates list', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.mail-templates.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/mail-templates/List'));
});

test('authorized users can search mail templates', function () {
    $this->actingAs($this->admin);
    MailTemplate::create([
        'key' => 'test_template',
        'subject' => 'Test Subject',
        'html_content' => '<p>Test</p>',
    ]);

    $response = $this->getJson(route('admin.mail-templates.search'));

    $response->assertOk();
    $response->assertJsonStructure(['dataList', 'meta']);
});

test('authorized users can view edit mail template page', function () {
    $this->actingAs($this->admin);
    $template = MailTemplate::create([
        'key' => 'edit_template',
        'subject' => 'Edit Me',
        'html_content' => '<p>Edit</p>',
    ]);

    $response = $this->get(route('admin.mail-templates.edit', $template));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/mail-templates/Edit'));
});

test('authorized users can update an existing mail template', function () {
    $this->actingAs($this->admin);
    $template = MailTemplate::create([
        'key' => 'update_template',
        'subject' => 'Old Subject',
        'html_content' => '<p>Old</p>',
    ]);

    $updateData = [
        'subject' => 'Updated Subject',
        'html_content' => '<p>Updated</p>',
    ];

    $response = $this->put(route('admin.mail-templates.update', $template), $updateData);

    $response->assertRedirect();
    $this->assertDatabaseHas('mail_templates', [
        'id' => $template->id,
        'subject' => 'Updated Subject',
        'html_content' => '<p>Updated</p>',
    ]);
});

test('authorized users can preview mail template', function () {
    $this->actingAs($this->admin);
    $template = MailTemplate::create([
        'key' => 'preview_template',
        'subject' => 'Preview Subject {ACCOUNT_NAME}',
        'html_content' => '<p>Preview {TIME}</p>',
    ]);

    $response = $this->get(route('admin.mail-templates.preview', $template));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/html; charset=UTF-8');
});
