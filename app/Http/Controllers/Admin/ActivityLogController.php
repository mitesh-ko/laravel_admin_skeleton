<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\DTOs\GlobalSearchDTO;
use App\Http\Controllers\Controller;
use App\Utils\TableUtility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use OwenIt\Auditing\Models\Audit;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/activity-logs/List');
    }

    public function search(Request $request): JsonResponse
    {
        $query = Audit::with('user');

        $tableUtility = new TableUtility($query);

        $globalSearchFields = [
            ['key' => 'event', 'op' => 'like', 'mask' => '%{value}%'],
            ['key' => 'auditable_type', 'op' => 'like', 'mask' => '%{value}%'],
            ['key' => 'ip_address', 'op' => 'like', 'mask' => '%{value}%'],
        ];

        $tableUtility->applyGlobalSearch($request, new GlobalSearchDTO($globalSearchFields));
        $tableUtility->applyFilters($request);
        $tableUtility->sort($request);
        $tableUtility->paginate($request);

        return $tableUtility->dataTableResponse($request);
    }

    public function show(Audit $activity_log): Response
    {
        $activity_log->load('user');

        return Inertia::render('admin/activity-logs/View', [
            'audit' => $activity_log,
        ]);
    }
}
