<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\DTOs\GlobalSearchDTO;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Utils\TableUtility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use OwenIt\Auditing\Models\Audit;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        Gate::authorize(PermissionName::MANAGE_ACTIVITY_LOGS->value);

        return Inertia::render('admin/activity-logs/List');
    }

    public function search(Request $request): JsonResponse
    {
        Gate::authorize(PermissionName::MANAGE_ACTIVITY_LOGS->value);
        $query = Audit::with('user');

        $globalSearchFields = [
            ['key' => 'event', 'op' => 'like', 'mask' => '%{value}%'],
            ['key' => 'auditable_type', 'op' => 'like', 'mask' => '%{value}%'],
            ['key' => 'ip_address', 'op' => 'like', 'mask' => '%{value}%'],
        ];

        return TableUtility::process($query, $request, [
            'globalSearch' => new GlobalSearchDTO($globalSearchFields),
            'filter',
            'sort',
            'paginate',
        ]);
    }

    public function show(Audit $activity_log): Response
    {
        Gate::authorize(PermissionName::MANAGE_ACTIVITY_LOGS->value);
        $activity_log->load('user');

        return Inertia::render('admin/activity-logs/View', [
            'audit' => $activity_log,
        ]);
    }
}
