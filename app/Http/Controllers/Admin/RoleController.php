<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Role\CreateRoleAction;
use App\Actions\Admin\Role\DeleteRoleAction;
use App\Actions\Admin\Role\UpdateRoleAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Utils\TableUtility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/roles/List');
    }

    public function search(Request $request)
    {
        $query = Role::withCount('permissions');

        $tableUtility = new TableUtility($query);
        // $tableUtility->applyGlobalSearch($request, new GlobalSearchDTO(User::GLOBAL_SEARCH));
        $tableUtility->applyFilters($request);
        $tableUtility->sort($request);
        $data = $tableUtility->paginate($request);

        return $tableUtility->dataTableResponse($request);
    }

    public function create()
    {
        $permissions = Permission::orderBy('module')->orderBy('id')->get()->groupBy('module');

        return Inertia::render('admin/roles/Form', [
            'groupedPermissions' => $permissions,
            'role' => null,
            'rolePermissions' => [],
        ]);
    }

    public function store(StoreRoleRequest $request, CreateRoleAction $action)
    {
        try {
            $action->execute($request->validated());

            return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function edit(Role $role)
    {
        $permissions = Permission::orderBy('module')->orderBy('id')->get()->groupBy('module');
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return Inertia::render('admin/roles/Form', [
            'groupedPermissions' => $permissions,
            'role' => $role,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role, UpdateRoleAction $action)
    {
        try {
            $action->execute($role, $request->validated());

            return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Role $role, DeleteRoleAction $action)
    {
        try {
            $action->execute($role);

            return back()->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
