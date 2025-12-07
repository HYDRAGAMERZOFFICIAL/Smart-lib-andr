<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'errors' => (object) [],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            // Get all validated data
            $validated = $request->validated();
            
            // Remove photo from validated data to handle it separately
            if (isset($validated['photo'])) {
                unset($validated['photo']);
            }
            
            // Handle photo upload separately
            if ($request->hasFile('photo')) {
                // Delete old photo if exists
                if ($user->photo && file_exists(storage_path('app/public/' . $user->photo))) {
                    unlink(storage_path('app/public/' . $user->photo));
                }
                
                $photoPath = $request->file('photo')->store('profile-photos', 'public');
                $user->photo = $photoPath;
            }
            
            $user->fill($validated);
    
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }
    
            $user->save();
    
            return Redirect::route('profile.edit')->with('status', 'profile-updated');
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Profile update error: ' . $e->getMessage());
            
            return Redirect::route('profile.edit')
                ->withErrors(['error' => 'An error occurred while updating your profile: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
