<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    private function authorizeStudent(Student $student)
    {
        $user = auth()->user();
        if ($user->role !== 'admin' && $student->created_by !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Student::query();
        
        if ($user->role !== 'admin') {
            $query->where('created_by', $user->id);
        }
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('id_number', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        $students = $query->latest()->paginate(25)->withQueryString();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ]
        ]);
    }

    public function show(Student $student)
    {
        $this->authorizeStudent($student);

        $activeLoans = $student->activeLoans()
            ->with('bookCopy.book')
            ->get();

        $borrowingHistory = $student->loans()
            ->where('status', 'returned')
            ->with('bookCopy.book')
            ->latest('returned_date')
            ->limit(20)
            ->get();

        $fines = $student->pendingFines()
            ->get();

        return Inertia::render('Students/Show', [
            'student' => $student,
            'activeLoans' => $activeLoans,
            'borrowingHistory' => $borrowingHistory,
            'fines' => $fines
        ]);
    }

    public function approve(Student $student)
    {
        $this->authorizeStudent($student);

        if ($student->status !== 'pending') {
            return back()->with('error', 'Only pending students can be approved');
        }

        $student->approve(auth()->user()->name);

        return back()->with('success', 'Student approved successfully');
    }

    public function reject(Student $student, Request $request)
    {
        $this->authorizeStudent($student);

        if ($student->status !== 'pending') {
            return back()->with('error', 'Only pending students can be rejected');
        }

        $student->reject(
            $request->input('reason'),
            auth()->user()->name
        );

        return back()->with('success', 'Student rejected successfully');
    }

    public function block(Student $student)
    {
        $this->authorizeStudent($student);

        if ($student->status === 'blocked') {
            return back()->with('error', 'Student is already blocked');
        }

        $student->block();

        return back()->with('success', 'Student blocked successfully');
    }

    public function unblock(Student $student)
    {
        $this->authorizeStudent($student);

        if ($student->status !== 'blocked') {
            return back()->with('error', 'Student is not blocked');
        }

        $student->unblock();

        return back()->with('success', 'Student unblocked successfully');
    }

    public function resetPassword(Student $student, Request $request)
    {
        $this->authorizeStudent($student);

        $request->validate([
            'new_password' => 'required|min:6'
        ]);

        $user = $student->user;
        if ($user) {
            $user->update(['password' => bcrypt($request->input('new_password'))]);
        }

        return back()->with('success', 'Password reset successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_number' => 'required|unique:students',
            'name' => 'required|string',
            'email' => 'required|email|unique:students',
            'phone' => 'nullable|string',
            'department' => 'required|string',
            'course' => 'required|string',
            'semester' => 'required|string'
        ]);

        $student = Student::create([
            ...$validated,
            'status' => 'pending'
        ]);

        return back()->with('success', 'Student created successfully');
    }

    public function update(Student $student, Request $request)
    {
        $validated = $request->validate([
            'name' => 'string',
            'email' => 'email|unique:students,email,' . $student->id,
            'phone' => 'nullable|string',
            'department' => 'string',
            'course' => 'string',
            'semester' => 'string',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string',
            'guardian_phone' => 'nullable|string'
        ]);

        $student->update($validated);

        return back()->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return back()->with('success', 'Student deleted successfully');
    }
}
