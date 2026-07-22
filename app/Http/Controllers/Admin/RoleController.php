<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Role\CreateRoleAction;
use App\Actions\Role\DeleteRoleAction;
use App\Actions\Role\UpdateRoleAction;
use App\Enums\PermissionName;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleStoreUpdateRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Utils\TableUtility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize(PermissionName::MANAGE_ROLES->value);

        return Inertia::render('admin/roles/List');
    }

    public function search(Request $request)
    {
        Gate::authorize(PermissionName::MANAGE_ROLES->value);
        $query = Role::withCount('permissions');

        if (! auth()->user()->can(PermissionName::MANAGE_ALL_ROLES->value)) {
            if (auth()->user()->can(PermissionName::MANAGE_OWN_ROLES->value)) {
                $query->where('created_by', auth()->id());
            } else {
                $query->where('id', null);
            }
        }

        return TableUtility::process($query, $request, [
            'filter',
            'sort',
            'paginate',
        ]);
    }

    public function create()
    {
        Gate::authorize(PermissionName::CREATE_ROLES->value);
        $permissions = Permission::orderBy('module')->orderBy('id')->get()->groupBy('module');

        return Inertia::render('admin/roles/CreateEdit', [
            'groupedPermissions' => $permissions,
            'role' => null,
            'rolePermissions' => [],
        ]);
    }

    public function store(RoleStoreUpdateRequest $request, CreateRoleAction $action)
    {
        try {
            $action->execute($request->toDTO());

            return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function edit(Role $role)
    {
        Gate::authorize('update', $role);
        $permissions = Permission::orderBy('module')->orderBy('id')->get()->groupBy('module');
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return Inertia::render('admin/roles/CreateEdit', [
            'groupedPermissions' => $permissions,
            'role' => $role,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(RoleStoreUpdateRequest $request, Role $role, UpdateRoleAction $action)
    {
        try {
            $action->execute($role, $request->toDTO());

            return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Role $role, DeleteRoleAction $action)
    {
        Gate::authorize('delete', $role);
        try {
            $action->execute($role);
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Role deleted successfully.']);
        } catch (\Exception $e) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $e->getMessage()]);
        }

        return redirect()->route('admin.roles.index');
    }
}
