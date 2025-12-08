<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_number' => 'required|string|max:50|unique:students',
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:students',
            'phone' => 'required|string|max:20',
            'department' => 'required|string|max:100',
            'course' => 'required|string|max:100',
            'semester' => 'required|string|max:2',
            'date_of_birth' => 'required|date',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'password' => ['required', 'confirmed', 'min:5','max:15','regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#()\/.]).+$/'],
        ]);

        $student = Student::create([
            'id_number' => $request->id_number,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'department' => $request->department,
            'course' => $request->course,
            'semester' => $request->semester,
            'date_of_birth' => $request->date_of_birth,
            'guardian_name' => $request->guardian_name,
            'guardian_phone' => $request->guardian_phone,
            'address' => $request->address,
            'status' => 'approved',
        ]);

        Auth::login($student);

        return redirect(route('dashboard', absolute: false));
    }
}
