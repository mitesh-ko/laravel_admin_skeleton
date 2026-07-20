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
use Rappasoft\LaravelAuthenticationLog\Models\AuthenticationLog;

class AuthenticationLogController extends Controller
{
    public function index(): Response
    {
        Gate::authorize(PermissionName::MANAGE_AUTHENTICATION_LOGS->value);

        return Inertia::render('admin/authentication-logs/List');
    }

    public function search(Request $request): JsonResponse
    {
        Gate::authorize(PermissionName::MANAGE_AUTHENTICATION_LOGS->value);
        $query = AuthenticationLog::with('authenticatable');

        $globalSearchFields = [
            ['key' => 'ip_address', 'op' => 'like', 'mask' => '%{value}%'],
            ['key' => 'user_agent', 'op' => 'like', 'mask' => '%{value}%'],
            ['key' => 'location', 'op' => 'like', 'mask' => '%{value}%'],
        ];

        return TableUtility::process($query, $request, [
            'globalSearch' => new GlobalSearchDTO($globalSearchFields),
            'filter',
            'sort',
            'paginate',
        ]);
    }
}
