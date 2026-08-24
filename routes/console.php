<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('exports:clean')->daily();
Schedule::command('notifications:clean')->daily();

// Database bloat prevention
Schedule::command('telescope:prune --hours=72')->daily();
Schedule::command('authentication-log:purge')->daily();
Schedule::command('media-library:clean')->daily();
Schedule::command('queue:prune-failed --hours=168')->daily();

// Clean up old audit logs (owen-it/laravel-auditing doesn't have a built-in command)
Schedule::call(function () {
    DB::table('audits')
        ->where('created_at', '<', now()->subDays(90))
        ->delete();
})->daily()->name('audits:clean');

// processes jobs, and exits without overlapping
Schedule::command('queue:work --stop-when-empty')
    ->everyMinute()
    ->withoutOverlapping();
