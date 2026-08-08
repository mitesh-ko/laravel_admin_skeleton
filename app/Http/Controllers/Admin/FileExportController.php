<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\DTOs\GlobalSearchDTO;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Models\FileExport;
use App\Utils\TableUtility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FileExportController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize(PermissionName::EXPORT_USERS->value);

        return Inertia::render('admin/file-exports/Index');
    }

    public function search(Request $request): JsonResponse
    {
        Gate::authorize(PermissionName::EXPORT_USERS->value);
        $exportsQuery = FileExport::where('user_id', $request->user()->id)
            ->select(['id', 'name', 'status', 'details', 'error_message', 'created_at', 'completed_at']);

        return TableUtility::process($exportsQuery, $request, [
            'globalSearch' => new GlobalSearchDTO(FileExport::GLOBAL_SEARCH),
            'filter',
            'sort',
            'paginate',
        ]);
    }

    public function download(Request $request, FileExport $fileExport)
    {
        if ($fileExport->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($fileExport->status !== 'completed' || ! $fileExport->file_path) {
            abort(404, 'File not ready or does not exist.');
        }

        if (! Storage::exists($fileExport->file_path)) {
            abort(404, 'File not found on storage.');
        }

        return Storage::download($fileExport->file_path);
    }
}
