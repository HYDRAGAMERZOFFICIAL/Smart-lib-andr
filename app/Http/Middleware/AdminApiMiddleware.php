<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminApiMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('services.admin_panel.enabled')) {
            return response()->json(['error' => 'Admin panel not enabled'], 403);
        }

        $apiKey = $request->header('X-Admin-API-Key');
        $secret = $request->header('X-Admin-Secret');

        if (!$apiKey || !$secret) {
            return response()->json(['error' => 'Missing API credentials'], 401);
        }

        if ($apiKey !== config('services.admin_panel.api_key') || 
            $secret !== config('services.admin_panel.secret')) {
            return response()->json(['error' => 'Invalid API credentials'], 401);
        }

        return $next($request);
    }
}
