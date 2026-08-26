<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ImpersonationController extends Controller
{
    /**
     * Show the PIN entry page for impersonation.
     */
    public function create(User $user): Response
    {
        return Inertia::render('admin/impersonate/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Authenticate and start impersonation.
     */
    public function store(Request $request, User $user)
    {
        $request->validate([
            'pin' => 'required|string|size:4',
        ]);

        if (empty($user->impersonation_token) || $user->impersonation_token !== strtoupper($request->pin)) {
            return back()->withErrors([
                'pin' => 'The provided PIN is incorrect or expired.',
            ]);
        }

        // Store current user ID in session
        Session::put('impersonated_by', Auth::id());

        // Regenerate the target user's PIN so it cannot be reused
        $user->generateImpersonationToken();
        $user->save();

        // Login as the target user
        Auth::login($user);

        return redirect()->route('admin.dashboard');
    }

    /**
     * Leave impersonation and revert to original user.
     */
    public function leave()
    {
        if (Session::has('impersonated_by')) {
            $originalUserId = Session::get('impersonated_by');

            // Re-login the original user
            Auth::loginUsingId($originalUserId);

            // Clear the impersonation session data
            Session::forget('impersonated_by');
        }

        return redirect()->route('admin.users.index');
    }
}
