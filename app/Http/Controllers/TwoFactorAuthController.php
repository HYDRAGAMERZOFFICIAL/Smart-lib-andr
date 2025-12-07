<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class TwoFactorAuthController extends Controller
{
    protected $google2fa;
    
    public function __construct(Google2FA $google2fa)
    {
        $this->google2fa = $google2fa;
    }
    /**
     * Show the 2FA setup page.
     */
    public function setup()
    {
        $user = Auth::user();
        
        // If 2FA is already enabled, redirect to the settings page
        if ($user->two_factor_enabled) {
            return redirect()->route('profile.edit')->with('status', '2FA is already enabled.');
        }
        
        // Generate a new secret key
        $secretKey = $this->google2fa->generateSecretKey();
        
        // Generate the QR code URL
        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secretKey
        );
        
        // Generate a QR code SVG
        $qrCode = null;
        try {
            // Check if BaconQrCodeGenerator is available
            if (class_exists('BaconQrCode\Renderer\Image\SvgImageBackEnd')) {
                $renderer = new \BaconQrCode\Renderer\ImageRenderer(
                    new \BaconQrCode\Renderer\RendererStyle\RendererStyle(200),
                    new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
                );
                $writer = new \BaconQrCode\Writer($renderer);
                $qrCode = $writer->writeString($qrCodeUrl);
            }
        } catch (\Exception $e) {
            // If there's an error, we'll just use the text version
            $qrCode = null;
        }
        
        // Store the secret key in the session for later verification
        session(['2fa_secret' => $secretKey]);
        
        return Inertia::render('Profile/TwoFactorAuth/Setup', [
            'qrCodeUrl' => $qrCodeUrl,
            'secretKey' => $secretKey,
            'qrCodeSvg' => $qrCode,
        ]);
    }
    
    /**
     * Enable 2FA for the user.
     */
    public function enable(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);
        
        $user = Auth::user();
        $secretKey = session('2fa_secret');
        
        // Verify the code
        $valid = $this->google2fa->verifyKey($secretKey, $request->code);
        
        if (!$valid) {
            return back()->withErrors(['code' => 'The provided code is invalid.']);
        }
        
        // Generate recovery codes
        $recoveryCodes = [];
        for ($i = 0; $i < 8; $i++) {
            $recoveryCodes[] = Str::random(10);
        }
        
        // Save the 2FA settings
        $user->two_factor_secret = $secretKey;
        $user->two_factor_recovery_codes = $recoveryCodes;
        $user->two_factor_enabled = true;
        $user->save();
        
        // Clear the session
        session()->forget('2fa_secret');
        
        return redirect()->route('profile.edit')->with('status', '2FA has been enabled.');
    }
    
    /**
     * Disable 2FA for the user.
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);
        
        $user = Auth::user();
        
        // Verify the password
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'The provided password is incorrect.']);
        }
        
        // Disable 2FA
        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_enabled = false;
        $user->save();
        
        return redirect()->route('profile.edit')->with('status', '2FA has been disabled.');
    }
    
    /**
     * Show the 2FA verification page.
     */
    public function verify()
    {
        // If 2FA is already verified, redirect to the dashboard
        if (session('2fa_verified')) {
            return redirect()->intended(route('dashboard'));
        }
        
        return Inertia::render('Auth/TwoFactorVerify');
    }
    
    /**
     * Verify the 2FA code.
     */
    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);
        
        $user = Auth::user();
        
        // Verify the code
        $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->code);
        
        if (!$valid) {
            return back()->withErrors(['code' => 'The provided code is invalid.']);
        }
        
        // Mark 2FA as verified in the session
        session(['2fa_verified' => true]);
        
        return redirect()->intended(route('dashboard'));
    }
    
    /**
     * Use a recovery code.
     */
    public function useRecoveryCode(Request $request)
    {
        $request->validate([
            'recovery_code' => 'required|string',
        ]);
        
        $user = Auth::user();
        $recoveryCodes = $user->two_factor_recovery_codes;
        
        // Check if the recovery code is valid
        $key = array_search($request->recovery_code, $recoveryCodes);
        
        if ($key === false) {
            return back()->withErrors(['recovery_code' => 'The provided recovery code is invalid.']);
        }
        
        // Remove the used recovery code
        unset($recoveryCodes[$key]);
        $user->two_factor_recovery_codes = array_values($recoveryCodes);
        $user->save();
        
        // Mark 2FA as verified in the session
        session(['2fa_verified' => true]);
        
        return redirect()->intended(route('dashboard'));
    }
}