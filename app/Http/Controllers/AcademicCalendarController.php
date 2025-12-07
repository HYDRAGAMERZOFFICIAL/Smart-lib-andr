<?php

namespace App\Http\Controllers;

use App\Models\AcademicCalendarEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicCalendarController extends Controller
{
    public function index()
    {
        $events = AcademicCalendarEvent::where('is_published', true)
            ->orderBy('start_date')
            ->get();

        return Inertia::render('AcademicCalendar/Index', ['events' => $events]);
    }

    public function download()
    {
        $pdfPath = storage_path('academic-calendars/calendar.pdf');

        if (!file_exists($pdfPath)) {
            return back()->with('error', 'Calendar PDF not available');
        }

        return response()->download($pdfPath, 'academic-calendar.pdf');
    }
}
