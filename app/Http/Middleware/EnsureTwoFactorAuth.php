<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        // If 2FA is not enabled for the user, proceed
        if (!$user || !$user->two_factor_enabled) {
            return $next($request);
        }
        
        // If 2FA is not verified, redirect to the verification page
        if (!session('2fa_verified')) {
            return redirect()->route('two-factor.verify');
        }
        
        return $next($request);
    }
}