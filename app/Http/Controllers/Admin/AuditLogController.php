<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::query()
            ->with('user')
            ->when($request->search, function ($q) use ($request) {
                $q->where('action', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%")
                  ->orWhereHas('user', function ($q) use ($request) {
                      $q->where('name', 'like', "%{$request->search}%");
                  });
            })
            ->when($request->action, function ($q) use ($request) {
                $q->where('action', $request->action);
            })
            ->when($request->date_from, function ($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->date_from);
            })
            ->when($request->date_to, function ($q) use ($request) {
                $q->whereDate('created_at', '<=', $request->date_to);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/AuditLogs', [
            'logs' => $logs,
            'filters' => [
                'search' => $request->search,
                'action' => $request->action,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
        ]);
    }
}
