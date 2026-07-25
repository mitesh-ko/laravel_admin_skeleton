<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UtmVisit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use OwenIt\Auditing\Models\Audit;
use Rappasoft\LaravelAuthenticationLog\Models\AuthenticationLog;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $totalUsers = User::count();
        $newRegistrations = User::where('created_at', '>=', now()->startOfWeek())->count();

        // 30 days of data, fill missing days with 0
        $startDate = now()->subDays(29)->startOfDay();
        $logs = AuthenticationLog::whereNotNull('login_at')
            ->where('login_at', '>=', $startDate)
            ->selectRaw('DATE(login_at) as date, count(*) as logins')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');

        $loginChartData = collect();
        for ($i = 29; $i >= 0; $i--) {
            $dateStr = now()->subDays($i)->format('Y-m-d');
            $loginChartData->push([
                'date' => now()->subDays($i)->format('M d'),
                'logins' => $logs->has($dateStr) ? $logs->get($dateStr)->logins : 0,
            ]);
        }

        $latestActivities = Audit::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($audit) {
                return [
                    'id' => $audit->id,
                    'user_name' => $audit->user ? $audit->user->name : 'System',
                    'event' => ucfirst($audit->event),
                    'auditable_type' => class_basename($audit->auditable_type),
                    'created_at' => $audit->created_at->diffForHumans(),
                ];
            });

        $utmTrafficData = UtmVisit::leftJoin('utm_sources', 'utm_visits.utm_source_id', '=', 'utm_sources.id')
            ->selectRaw('COALESCE(utm_sources.name, "Direct/None") as source, COALESCE(utm_sources.utm_campaign, "Unknown") as campaign, COUNT(utm_visits.id) as count')
            ->groupBy('utm_sources.name', 'utm_sources.utm_campaign')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        $utmRegistrationData = User::leftJoin('utm_visits', 'users.id', '=', 'utm_visits.user_id')
            ->leftJoin('utm_sources', 'utm_visits.utm_source_id', '=', 'utm_sources.id')
            ->selectRaw('COALESCE(utm_sources.name, "Direct/None") as source, COALESCE(utm_sources.utm_campaign, "Unknown") as campaign, COUNT(DISTINCT users.id) as count')
            ->groupBy('utm_sources.name', 'utm_sources.utm_campaign')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', [
            'totalUsers' => $totalUsers,
            'newRegistrations' => $newRegistrations,
            'loginChartData' => $loginChartData,
            'latestActivities' => $latestActivities,
            'utmTrafficData' => $utmTrafficData,
            'utmRegistrationData' => $utmRegistrationData,
        ]);
    }
}
