<?php

use App\Http\Controllers\Admin\ActivityLogController;
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
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::get('activity-logs/{audit}', [ActivityLogController::class, 'show'])->name('activity-logs.show');
});
