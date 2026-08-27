<?php

use App\DTOs\NotificationData;
use App\Models\User;
use App\Notifications\AppNotification;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('guests cannot access notifications list', function () {
    $response = $this->get(route('admin.notifications.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can access notifications list', function () {
    $this->actingAs($this->user);

    $response = $this->get(route('admin.notifications.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/notifications/Index'));
});

test('authenticated users can mark a notification as read', function () {
    $this->actingAs($this->user);

    $this->user->notify(new AppNotification(new NotificationData('Test Notification', 'This is a test notification')));

    $notification = $this->user->notifications()->first();
    $this->assertNull($notification->read_at);

    $response = $this->post(route('admin.notifications.mark-as-read', $notification->id));

    $response->assertRedirect();
    $this->assertNotNull($notification->fresh()->read_at);
});

test('authenticated users can mark all notifications as read', function () {
    $this->actingAs($this->user);

    $this->user->notify(new AppNotification(new NotificationData('Test Notification 1', 'This is a test notification 1')));
    $this->user->notify(new AppNotification(new NotificationData('Test Notification 2', 'This is a test notification 2')));

    $this->assertEquals(2, $this->user->unreadNotifications()->count());

    $response = $this->post(route('admin.notifications.mark-all-as-read'));

    $response->assertRedirect();
    $this->assertEquals(0, $this->user->unreadNotifications()->count());
});

test('authenticated users can delete a notification', function () {
    $this->actingAs($this->user);

    $this->user->notify(new AppNotification(new NotificationData('Test Notification', 'This is a test notification')));

    $notification = $this->user->notifications()->first();

    $response = $this->delete(route('admin.notifications.destroy', $notification->id));

    $response->assertRedirect();
    $this->assertDatabaseMissing('notifications', [
        'id' => $notification->id,
    ]);
});
