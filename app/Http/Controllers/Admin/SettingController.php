<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display the settings page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get settings from cache or use defaults
        $settings = Cache::get('app_settings', [
            'app_name' => 'PERAFINCORE',
            'currency_symbol' => '₹',
            'allow_registration' => true,
            'maintenance_mode' => false,
        ]);
        
        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }
    
    /**
     * Update the application settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'app_name' => 'required|string|max:255',
            'currency_symbol' => 'required|string|max:10',
            'allow_registration' => 'boolean',
            'maintenance_mode' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator);
        }
        
        // Store settings in cache
        $settings = [
            'app_name' => $request->app_name,
            'currency_symbol' => $request->currency_symbol,
            'allow_registration' => (bool) $request->allow_registration,
            'maintenance_mode' => (bool) $request->maintenance_mode,
        ];
        
        Cache::forever('app_settings', $settings);
        
        return back()->with('success', 'Settings updated successfully.');
    }
}
