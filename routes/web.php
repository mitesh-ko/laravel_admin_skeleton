<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AuthenticationLogController;
use App\Http\Controllers\Admin\ImpersonationController;
use App\Http\Controllers\Admin\MailTemplateController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UtmSourceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

use App\Http\Controllers\Admin\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('api/users/search', [UserController::class, 'search'])->name('users.search');
    Route::resource('users', UserController::class);

    Route::get('impersonate/{user}', [ImpersonationController::class, 'create'])->name('impersonate');
    Route::post('impersonate/{user}', [ImpersonationController::class, 'store'])->name('impersonate.store');
    Route::post('impersonate-leave', [ImpersonationController::class, 'leave'])->name('impersonate.leave');

    Route::get('api/activity-logs/search', [ActivityLogController::class, 'search'])->name('activity-logs.search');
    Route::resource('activity-logs', ActivityLogController::class)->only(['index', 'show']);

    Route::get('api/authentication-logs/search', [AuthenticationLogController::class, 'search'])->name('authentication-logs.search');
    Route::resource('authentication-logs', AuthenticationLogController::class)->only(['index']);

    Route::get('api/roles/search', [RoleController::class, 'search'])->name('roles.search');
    Route::resource('roles', RoleController::class);

    Route::get('api/mail-templates/search', [MailTemplateController::class, 'search'])->name('mail-templates.search');
    Route::get('api/mail-templates/{mail_template}/preview', [MailTemplateController::class, 'preview'])->name('mail-templates.preview');
    Route::get('/settings/general', [SettingController::class, 'editGeneral'])->name('settings.edit-general');
    Route::put('/settings/general', [SettingController::class, 'updateGeneral'])->name('settings.update-general');
    Route::get('/settings/mail', [SettingController::class, 'editMail'])->name('settings.edit-mail');
    Route::put('/settings/mail', [SettingController::class, 'updateMail'])->name('settings.update-mail');
    Route::resource('mail-templates', MailTemplateController::class)->only(['index', 'edit', 'update']);

    Route::get('api/utm-sources/search', [UtmSourceController::class, 'search'])->name('utm-sources.search');
    Route::resource('utm-sources', UtmSourceController::class);
});
