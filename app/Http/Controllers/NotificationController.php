<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $notifications = Notification::where('user_id', $user->id)
            ->where('read_at', null)
            ->latest()
            ->paginate(20);

        return Inertia::render('Notifications/Index', ['notifications' => $notifications]);
    }

    public function history()
    {
        $user = auth()->user();

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Notifications/History', ['notifications' => $notifications]);
    }
}
