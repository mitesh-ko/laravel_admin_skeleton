<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\User\CreateUserAction;
use App\Actions\User\DeleteUserAction;
use App\Actions\User\UpdateUserAction;
use App\DTOs\GlobalSearchDTO;
use App\Enums\PermissionName;
use App\Enums\SystemRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreUpdateRequest;
use App\Models\Permission;
use App\Models\User;
use App\Utils\TableUtility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize(PermissionName::MANAGE_USERS->value);

        return Inertia::render('admin/users/List');
    }

    /**
     * API endpoint for fetching users data for AdvancedTable.
     */
    public function search(Request $request): JsonResponse
    {
        Gate::authorize(PermissionName::MANAGE_USERS->value);
        $usersQuery = User::select(['id', 'name', 'email', 'created_at'])
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', SystemRole::SUPER_ADMIN->value);
            })
            ->with('roles');

        return TableUtility::process($usersQuery, $request, [
            'globalSearch' => new GlobalSearchDTO(User::GLOBAL_SEARCH),
            'filter',
            'sort',
            'paginate',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize(PermissionName::CREATE_USERS->value);

        return Inertia::render('admin/users/CreateEdit', [
            'roles' => Role::all()->pluck('name'),
            'permissions' => Permission::all()->pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreUpdateRequest $request, CreateUserAction $action): RedirectResponse
    {
        $action->execute($request->toDTO());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User created successfully.']);

        return redirect()->route('admin.users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        Gate::authorize(PermissionName::MANAGE_USERS->value);
        $user->load(['roles', 'permissions']);

        return Inertia::render('admin/users/View', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        Gate::authorize(PermissionName::EDIT_USERS->value);
        $user->load(['roles', 'permissions']);

        return Inertia::render('admin/users/CreateEdit', [
            'user' => $user,
            'roles' => Role::all()->pluck('name'),
            'permissions' => Permission::all()->pluck('name'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserStoreUpdateRequest $request, User $user, UpdateUserAction $action): RedirectResponse
    {
        $action->execute($user, $request->toDTO());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User updated successfully.']);

        return redirect()->route('admin.users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, DeleteUserAction $action): RedirectResponse
    {
        Gate::authorize(PermissionName::DELETE_USERS->value);
        $action->execute($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User deleted successfully.']);

        return redirect()->route('admin.users.index');
    }
}
