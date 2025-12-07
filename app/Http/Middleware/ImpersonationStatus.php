<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImpersonationStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is impersonating
        $isImpersonating = $request->session()->has('impersonator_id');
        
        // Share the impersonation status with Inertia
        Inertia::share('impersonating', $isImpersonating);
        
        return $next($request);
    }
}