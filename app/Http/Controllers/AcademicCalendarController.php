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

    public function create()
    {
        return Inertia::render('AcademicCalendar/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|in:holiday,exam,library_closed,event',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i'
        ]);

        AcademicCalendarEvent::create([
            ...$validated,
            'is_published' => true,
            'created_by' => auth()->user()->name
        ]);

        return redirect()->route('academic-calendar.index')->with('success', 'Event created successfully');
    }

    public function edit(AcademicCalendarEvent $academicCalendar)
    {
        return Inertia::render('AcademicCalendar/Edit', ['event' => $academicCalendar]);
    }

    public function update(AcademicCalendarEvent $academicCalendar, Request $request)
    {
        $validated = $request->validate([
            'title' => 'string',
            'description' => 'nullable|string',
            'type' => 'in:holiday,exam,library_closed,event',
            'start_date' => 'date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i'
        ]);

        $academicCalendar->update($validated);

        return back()->with('success', 'Event updated successfully');
    }

    public function destroy(AcademicCalendarEvent $academicCalendar)
    {
        $academicCalendar->delete();

        return back()->with('success', 'Event deleted successfully');
    }

    public function uploadPdf(Request $request)
    {
        $request->validate(['pdf' => 'required|file|mimes:pdf|max:10000']);

        $path = $request->file('pdf')->store('academic-calendars', 'public');

        return back()->with('success', 'Calendar PDF uploaded successfully');
    }
}
