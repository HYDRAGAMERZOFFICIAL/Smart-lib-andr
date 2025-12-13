<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'is_admin', 'is_approved', 'email_verified_at', 'photo', 'mobile', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }
    
    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'is_admin' => 'required|boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => Hash::make($request->password),
            'is_admin' => $request->boolean('is_admin'),
            'is_approved' => true,
        ]);
        
        return back()->with('success', 'User created successfully.');
    }
    
    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->id,
            'mobile' => 'nullable|string|max:20',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'is_admin' => 'required|boolean',
            'is_approved' => 'required|boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        $user = User::findOrFail($request->id);
        
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'is_admin' => $request->boolean('is_admin'),
            'is_approved' => $request->boolean('is_approved'),
        ];
        
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }
        
        $user->update($userData);
        
        return back()->with('success', 'User updated successfully.');
    }
    
    /**
     * Remove the specified user from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:users,id',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        // Prevent deleting your own account
        if ($request->id == auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        
        $user = User::findOrFail($request->id);
        $user->delete();
        
        return back()->with('success', 'User deleted successfully.');
    }
    
    /**
     * Update the user's admin status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateRole(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userId' => 'required|exists:users,id',
            'is_admin' => 'required|boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        $user = User::findOrFail($request->userId);
        $user->is_admin = $request->boolean('is_admin');
        $user->save();
        
        return back()->with('success', 'User admin status updated successfully.');
    }
    
    /**
     * Impersonate a user (login as another user).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function impersonate(Request $request)
    {
        // Ensure only admins can impersonate users
        if (!auth()->user()->is_admin) {
            abort(403, 'Unauthorized action.');
        }
        
        $validator = Validator::make($request->all(), [
            'userId' => 'required|exists:users,id',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        // Prevent impersonating yourself
        if ($request->userId == auth()->id()) {
            return back()->with('error', 'You cannot impersonate yourself.');
        }
        
        // Store the current admin's ID in the session
        $request->session()->put('impersonator_id', auth()->id());
        
        // Login as the target user
        auth()->loginUsingId($request->userId);
        
        return redirect()->route('dashboard')->with('success', 'You are now logged in as ' . auth()->user()->name);
    }
    
    /**
     * Stop impersonating a user and return to admin account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function stopImpersonating(Request $request)
    {
        // Check if the user is impersonating
        if (!$request->session()->has('impersonator_id')) {
            return redirect()->route('dashboard');
        }
        
        // Get the original admin ID
        $adminId = $request->session()->pull('impersonator_id');
        
        // Login as the original admin
        auth()->loginUsingId($adminId);
        
        return redirect()->route('admin.dashboard')->with('success', 'Returned to admin account');
    }
}
