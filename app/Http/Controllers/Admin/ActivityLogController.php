<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\DTOs\GlobalSearchDTO;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Utils\TableUtility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use OwenIt\Auditing\Models\Audit;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize(PermissionName::MANAGE_ACTIVITY_LOGS->value);

        $userName = null;
        if ($request->filled('user_id')) {
            $user = User::find($request->input('user_id'));
            if ($user) {
                $userName = $user->name;
            }
        }

        return Inertia::render('admin/activity-logs/List', [
            'userId' => $request->input('user_id'),
            'userName' => $userName,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        Gate::authorize(PermissionName::MANAGE_ACTIVITY_LOGS->value);
        $query = Audit::with('user');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

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
