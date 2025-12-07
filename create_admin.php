<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'smartlibadm@gmail.com';
$password = 'Smart@lib11';

$user = User::where('email', $email)->first();

if ($user) {
    $user->password = Hash::make($password);
    $user->role = 'admin';
    $user->is_approved = true;
    $user->email_verified_at = now();
    $user->save();
    echo "Admin user updated successfully!\n";
    echo "Email: {$email}\n";
    echo "Password: {$password}\n";
    echo "Role: admin\n";
} else {
    $user = User::create([
        'name' => 'Admin',
        'email' => $email,
        'password' => Hash::make($password),
        'role' => 'admin',
        'is_approved' => true,
        'email_verified_at' => now(),
    ]);
    echo "Admin user created successfully!\n";
    echo "Email: {$email}\n";
    echo "Password: {$password}\n";
    echo "Role: admin\n";
}
?>
