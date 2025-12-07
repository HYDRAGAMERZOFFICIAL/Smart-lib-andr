<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Smart Library Admin',
            'email' => 'smartlibadmin@lib.com',
            'email_verified_at' => now(),
            'password' => Hash::make('Smartlib@admin1'),
            'role' => 'admin',
            'is_approved' => true,
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);

        $this->command->info('Admin user created successfully!');
    }
}
