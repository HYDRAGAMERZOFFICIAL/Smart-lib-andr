<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login()
    {
        return Inertia::render('Login');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'idNumber' => 'required|string|exists:users,id_number',
            'password' => 'required|string',
        ]);

        $user = User::where('id_number', $validated['idNumber'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return back()->withErrors(['email' => 'Invalid credentials.']);
        }

        if (!$user->is_approved) {
            return back()->withErrors(['email' => 'Your account is pending approval.']);
        }

        auth()->login($user, true);

        return redirect()->intended('/dashboard');
    }

    public function logout()
    {
        auth()->logout();
        return redirect('/login');
    }

    public function register()
    {
        return Inertia::render('Register');
    }

    public function storeRegister(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'idNumber' => 'required|string|unique:users,id_number',
            'phone' => 'required|string',
            'department' => 'required|string',
            'semester' => 'required|string',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = User::create([
            'name' => $validated['fullName'],
            'id_number' => $validated['idNumber'],
            'phone' => $validated['phone'],
            'department' => $validated['department'],
            'semester' => $validated['semester'],
            'password' => Hash::make($validated['password']),
            'is_approved' => false,
        ]);

        return redirect('/login')->with('message', 'Registration successful. Awaiting approval.');
    }
}
