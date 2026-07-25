<?php

namespace App\Http\Controllers\Admin;

use App\Actions\UtmSource\CreateUtmSourceAction;
use App\Actions\UtmSource\DeleteUtmSourceAction;
use App\Actions\UtmSource\UpdateUtmSourceAction;
use App\DTOs\GlobalSearchDTO;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveUtmSourceRequest;
use App\Models\UtmSource;
use App\Utils\TableUtility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UtmSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize(PermissionName::MANAGE_UTM_SOURCES->value);

        return Inertia::render('admin/utm-sources/List');
    }

    /**
     * Search endpoint for AdvancedTable.
     */
    public function search(Request $request)
    {
        Gate::authorize(PermissionName::MANAGE_UTM_SOURCES->value);

        $query = UtmSource::query()->withCount(['visits', 'registrations']);

        return TableUtility::process($query, $request, [
            'globalSearch' => new GlobalSearchDTO(UtmSource::GLOBAL_SEARCH),
            'filter',
            'sort',
            'paginate',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize(PermissionName::CREATE_UTM_SOURCES->value);

        return Inertia::render('admin/utm-sources/CreateEdit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SaveUtmSourceRequest $request, CreateUtmSourceAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('admin.utm-sources.index')->with('success', 'UTM Source created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(UtmSource $utmSource)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UtmSource $utmSource)
    {
        Gate::authorize(PermissionName::EDIT_UTM_SOURCES->value);

        return Inertia::render('admin/utm-sources/CreateEdit', [
            'utmSource' => $utmSource,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SaveUtmSourceRequest $request, UtmSource $utmSource, UpdateUtmSourceAction $action)
    {
        $action->execute($utmSource, $request->validated());

        return redirect()->route('admin.utm-sources.index')->with('success', 'UTM Source updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UtmSource $utmSource, DeleteUtmSourceAction $action)
    {
        Gate::authorize(PermissionName::DELETE_UTM_SOURCES->value);

        $action->execute($utmSource);

        return redirect()->route('admin.utm-sources.index')->with('success', 'UTM Source deleted successfully.');
    }
}
