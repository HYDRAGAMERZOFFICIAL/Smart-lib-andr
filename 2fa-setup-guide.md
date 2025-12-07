# Two-Factor Authentication Setup Guide

This guide will help you set up and use Two-Factor Authentication (2FA) with Google Authenticator in your Laravel application.

## Prerequisites

1. Make sure you have installed the required packages:
   ```bash
   composer require pragmarx/google2fa-laravel bacon/bacon-qr-code
   ```

2. Publish the Google2FA configuration file:
   ```bash
   php artisan vendor:publish --provider="PragmaRX\Google2FA\Vendor\Laravel\ServiceProvider"
   ```

3. Run the migration to add 2FA columns to the users table:
   ```bash
   php artisan migrate
   ```

   npm install @headlessui/react@latest
   npm install qrcode.react

## How to Use 2FA

### Enabling 2FA

1. Go to your profile page by clicking on your name in the top-right corner and selecting "Profile"
2. Scroll down to the "Two-Factor Authentication" section
3. Click the "Enable Two-Factor Authentication" button
4. You'll be redirected to the 2FA setup page
5. Scan the QR code with your Google Authenticator app (or any other TOTP app)
6. Enter the 6-digit code from your authenticator app
7. Click "Verify and Enable"
8. 2FA is now enabled for your account

### Using 2FA When Logging In

1. After entering your email and password, you'll be redirected to the 2FA verification page
2. Open your Google Authenticator app and enter the 6-digit code
3. Click "Verify"
4. If the code is correct, you'll be logged in

### Using Recovery Codes

If you lose access to your authenticator app, you can use a recovery code:

1. On the 2FA verification page, click "Use a recovery code"
2. Enter one of your recovery codes
3. Click "Verify"
4. If the code is correct, you'll be logged in
5. Note that each recovery code can only be used once

### Disabling 2FA

1. Go to your profile page
2. Scroll down to the "Two-Factor Authentication" section
3. Click the "Disable Two-Factor Authentication" button
4. Enter your password to confirm
5. Click "Disable"
6. 2FA is now disabled for your account

## Troubleshooting

### QR Code Not Displaying

If the QR code is not displaying, make sure you have the `bacon/bacon-qr-code` package installed:

```bash
composer require bacon/bacon-qr-code
```

### 2FA Not Working After Login

Make sure the middleware is properly configured in your `app/Http/Kernel.php` file:

```php
protected $middlewareAliases = [
    // Other middleware...
    '2fa' => \App\Http\Middleware\EnsureTwoFactorAuth::class,
];
```

And that your routes are protected with the middleware:

```php
Route::middleware(['auth', 'verified', '2fa'])->group(function () {
    // Protected routes
});
```

### Import Errors with Toast

If you're seeing import errors with the toast utility, make sure you have react-hot-toast installed:

```bash
npm install react-hot-toast
```

Or use the inline toast utility provided in the components.


npm install @heroicons/react