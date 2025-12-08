<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('Notifications/Index', ['notifications' => []]);
        }

        $notifications = Notification::forStudent($student->id)
            ->unread()
            ->latest()
            ->paginate(20);

        return Inertia::render('Notifications/Index', ['notifications' => $notifications]);
    }

    public function history()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('Notifications/History', ['notifications' => []]);
        }

        $notifications = Notification::forStudent($student->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Notifications/History', ['notifications' => $notifications]);
    }
}
