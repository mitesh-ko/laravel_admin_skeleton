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
use Illuminate\Http\RedirectResponse;
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
        $users = User::with('roles')->latest()->paginate(10);

        return Inertia::render('admin/users/Index', [
            'users' => $users,
        ]);
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
