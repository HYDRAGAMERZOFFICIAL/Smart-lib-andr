<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Call our custom seeders in the correct order
        $this->call([
            AdminUserSeeder::class,    // First create admin user
            CategorySeeder::class,     // Then create categories
            TransactionSeeder::class,  // Then create transactions
            BudgetSeeder::class,       // Finally create budgets
        ]);
    }
}
