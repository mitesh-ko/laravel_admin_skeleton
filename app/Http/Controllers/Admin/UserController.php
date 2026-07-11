<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\User\CreateUserAction;
use App\Actions\User\DeleteUserAction;
use App\Actions\User\UpdateUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Models\User;
use App\Utils\TableUtility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        return Inertia::render('admin/users/Index');
    }

    /**
     * API endpoint for fetching users data for AdvancedTable.
     */
    public function search(Request $request): JsonResponse
    {
        $usersQuery = User::with('roles');

        // Handle Global Search (globalFilter)
        $globalFilter = $request->input('globalFilter');
        if (! empty($globalFilter)) {
            $usersQuery->where(function ($q) use ($globalFilter) {
                $q->where('name', 'like', "%{$globalFilter}%")
                    ->orWhere('email', 'like', "%{$globalFilter}%");
            });
        }

        $tableUtility = new TableUtility($usersQuery);
        $tableUtility->applyFilters($request);
        $tableUtility->sort($request);
        $data = $tableUtility->paginate($request);

        // Optional mapping could go here if we needed to mutate user data
        // $processedData = $data->map(function ($user) { return $user; });

        return $tableUtility->dataTableResponse($request);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/CreateEdit', [
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request, CreateUserAction $action): RedirectResponse
    {
        $action->execute($request->toDTO());

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $user->load('roles');

        return Inertia::render('admin/users/CreateEdit', [
            'user' => $user,
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user, UpdateUserAction $action): RedirectResponse
    {
        $action->execute($user, $request->toDTO());

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, DeleteUserAction $action): RedirectResponse
    {
        $action->execute($user);

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
