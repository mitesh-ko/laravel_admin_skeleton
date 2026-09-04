<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class VerifySessionFingerprint
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return $next($request);
        }

        $session = $request->session();
        $currentIp = $request->ip();
        $currentAgent = $request->userAgent();

        if (! $session->has('session_fingerprint')) {
            $session->put('session_fingerprint', [
                'ip' => $currentIp,
                'user_agent' => $currentAgent,
            ]);
        } else {
            $fingerprint = $session->get('session_fingerprint');

            // Defense mechanism against session hijacking.
            // We check the user agent strictly. We allow the IP to change (e.g. mobile networks)
            // but log it if needed, or simply update it.
            if ($fingerprint['user_agent'] !== $currentAgent) {
                Log::warning('Session hijacking defense triggered.', [
                    'user_id' => Auth::id(),
                    'expected_agent' => $fingerprint['user_agent'],
                    'actual_agent' => $currentAgent,
                    'ip' => $currentIp,
                ]);

                Auth::logout();
                $session->invalidate();
                $session->regenerateToken();

                // Redirect to login page
                return redirect()->route('login');
            }

            // Update the IP in the fingerprint if it changed, to always have the latest logged-in IP for this session.
            if ($fingerprint['ip'] !== $currentIp) {
                $fingerprint['ip'] = $currentIp;
                $session->put('session_fingerprint', $fingerprint);
            }
        }

        return $next($request);
    }
}
