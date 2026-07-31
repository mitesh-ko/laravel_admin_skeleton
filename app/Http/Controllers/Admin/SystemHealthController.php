<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SystemHealthController extends Controller
{
    public function index()
    {
        Gate::authorize(PermissionName::MANAGE_SYSTEM_HEALTH->value);

        $dbStatus = 'offline';
        try {
            DB::connection()->getPdo();
            $dbStatus = 'online';
        } catch (\Exception $e) {
            $dbStatus = 'error: '.$e->getMessage();
        }

        // Check jobs table if we are using database queue driver
        $pendingJobs = 0;
        $failedJobs = 0;
        try {
            if (config('queue.default') === 'database') {
                $pendingJobs = DB::table('jobs')->count();
                $failedJobs = DB::table('failed_jobs')->count();
            }
        } catch (\Exception $e) {
            // ignore if table doesn't exist
        }

        return Inertia::render('admin/system-health/Index', [
            'health' => [
                'database' => $dbStatus,
                'queue' => [
                    'driver' => config('queue.default'),
                    'pending_jobs' => $pendingJobs,
                    'failed_jobs' => $failedJobs,
                ],
            ],
        ]);
    }

    public function logs()
    {
        Gate::authorize(PermissionName::MANAGE_SYSTEM_HEALTH->value);

        $logPath = storage_path('logs/laravel.log');

        if (! File::exists($logPath)) {
            return response()->json(['log' => 'Log file not found.']);
        }

        // Get the last 1000 lines to prevent memory issues with large files
        $file = new \SplFileObject($logPath, 'r');
        $file->seek(PHP_INT_MAX);
        $totalLines = $file->key();

        $startLine = max(0, $totalLines - 1000);
        $file->seek($startLine);

        $lines = [];
        while (! $file->eof()) {
            $lines[] = $file->current();
            $file->next();
        }

        return response()->json(['log' => implode('', $lines)]);
    }

    public function clearCache()
    {
        Gate::authorize(PermissionName::MANAGE_SYSTEM_HEALTH->value);

        Artisan::call('optimize:clear');

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Application cache cleared successfully.']);

        return back();
    }
}
