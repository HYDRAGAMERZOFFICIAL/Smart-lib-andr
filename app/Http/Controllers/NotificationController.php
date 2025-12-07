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
        $notifications = Notification::where('student_id', auth()->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Notifications/Index', ['notifications' => $notifications]);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:announcement,alert,due_reminder',
            'title' => 'required|string',
            'message' => 'required|string',
            'subject' => 'nullable|string',
            'channel' => 'required|in:email,sms,in_app,all',
            'target' => 'required|in:all,department,semester,individual',
            'department' => 'nullable|string',
            'semester' => 'nullable|string',
            'student_id' => 'nullable|exists:students,id'
        ]);

        $query = Notification::query();

        if ($validated['target'] === 'all') {
            $students = Student::all();
        } elseif ($validated['target'] === 'department') {
            $students = Student::where('department', $validated['department'])->get();
        } elseif ($validated['target'] === 'semester') {
            $students = Student::where('semester', $validated['semester'])->get();
        } else {
            $students = Student::where('id', $validated['student_id'])->get();
        }

        foreach ($students as $student) {
            Notification::create([
                'student_id' => $student->id,
                'type' => $validated['type'],
                'title' => $validated['title'],
                'message' => $validated['message'],
                'subject' => $validated['subject'],
                'channel' => $validated['channel'],
                'created_by' => auth()->user()->name
            ]);
        }

        return back()->with('success', 'Notifications sent successfully to ' . count($students) . ' student(s)');
    }

    public function history()
    {
        $notifications = Notification::orderBy('created_at', 'desc')->get();

        return Inertia::render('Notifications/History', ['notifications' => $notifications]);
    }
}
