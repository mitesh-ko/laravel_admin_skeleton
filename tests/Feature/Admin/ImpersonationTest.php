<?php

use App\Models\User;
use Illuminate\Support\Facades\Session;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->targetUser = User::factory()->create();
});

test('users can view impersonation pin page', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.impersonate', $this->targetUser));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/impersonate/Index'));
});

test('users cannot impersonate with incorrect pin', function () {
    $this->actingAs($this->admin);

    $this->targetUser->impersonation_token = '1234';
    $this->targetUser->save();

    $response = $this->post(route('admin.impersonate.store', $this->targetUser), [
        'pin' => '9999',
    ]);

    $response->assertSessionHasErrors(['pin']);

    // Ensure we are still logged in as admin
    $this->assertAuthenticatedAs($this->admin);
});

test('users can impersonate with correct pin', function () {
    $this->actingAs($this->admin);

    $this->targetUser->impersonation_token = '1234';
    $this->targetUser->save();

    $response = $this->post(route('admin.impersonate.store', $this->targetUser), [
        'pin' => '1234',
    ]);

    $response->assertRedirect(route('admin.dashboard'));

    // Ensure we are now logged in as target user
    $this->assertAuthenticatedAs($this->targetUser);

    // Ensure session has impersonated_by set
    $this->assertEquals($this->admin->id, Session::get('impersonated_by'));

    // Ensure the token was reset
    $this->assertNotEquals('1234', $this->targetUser->fresh()->impersonation_token);
});

test('users can leave impersonation', function () {
    // Start by being logged in as target user, but with the impersonated_by session
    $this->actingAs($this->targetUser);
    Session::put('impersonated_by', $this->admin->id);

    $response = $this->post(route('admin.impersonate.leave'));

    $response->assertRedirect(route('admin.users.index'));

    // Ensure we are now logged in as the original admin
    $this->assertAuthenticatedAs($this->admin);

    // Ensure session no longer has impersonated_by
    $this->assertFalse(Session::has('impersonated_by'));
});
