<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Student;

echo "=== Database Test ===\n";
echo "Total Users: " . User::count() . "\n";
echo "Total Students: " . Student::count() . "\n";

$students = Student::limit(3)->get();
echo "\nFirst 3 Students:\n";
foreach ($students as $student) {
    echo "- {$student->name} ({$student->email}) Status: {$student->status}\n";
    $user = User::where('email', $student->email)->first();
    if ($user) {
        echo "  ✓ User found: {$user->name}\n";
    } else {
        echo "  ✗ NO USER FOUND FOR THIS EMAIL\n";
    }
}
