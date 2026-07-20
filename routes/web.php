<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AuthenticationLogController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('api/users/search', [UserController::class, 'search'])->name('users.search');
    Route::resource('users', UserController::class);

    Route::get('api/activity-logs/search', [ActivityLogController::class, 'search'])->name('activity-logs.search');
    Route::resource('activity-logs', ActivityLogController::class)->only(['index', 'show']);

    Route::get('api/authentication-logs/search', [AuthenticationLogController::class, 'search'])->name('authentication-logs.search');
    Route::resource('authentication-logs', AuthenticationLogController::class)->only(['index']);

    Route::get('api/roles/search', [RoleController::class, 'search'])->name('roles.search');
    Route::resource('roles', RoleController::class);
});
