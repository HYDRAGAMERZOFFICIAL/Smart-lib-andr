<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Budget;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class TestDatabaseSeeder extends Seeder
{
    /**
     * Seed the test database with minimal data for testing.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Test Admin',
            'email' => 'testadmin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'member',
        ]);

        // Create categories for the regular user
        $this->createCategories($user);

        // Create transactions for the regular user
        $this->createTransactions($user);

        // Create budgets for the regular user
        $this->createBudgets($user);
    }

    /**
     * Create basic categories for testing
     */
    private function createCategories($user): void
    {
        // Expense categories
        $expenseCategories = [
            [
                'name' => 'Groceries',
                'type' => 'expense',
                'color' => '#4CAF50',
                'description' => 'Daily groceries and household items',
            ],
            [
                'name' => 'Rent',
                'type' => 'expense',
                'color' => '#FF5722',
                'description' => 'Monthly house rent',
            ],
            [
                'name' => 'Transportation',
                'type' => 'expense',
                'color' => '#2196F3',
                'description' => 'Transportation expenses',
            ],
        ];

        // Income categories
        $incomeCategories = [
            [
                'name' => 'Salary',
                'type' => 'income',
                'color' => '#4CAF50',
                'description' => 'Monthly salary',
            ],
            [
                'name' => 'Freelance',
                'type' => 'income',
                'color' => '#9C27B0',
                'description' => 'Freelance income',
            ],
        ];

        // Create expense categories
        foreach ($expenseCategories as $category) {
            Category::create([
                'user_id' => $user->id,
                'name' => $category['name'],
                'type' => $category['type'],
                'color' => $category['color'],
                'description' => $category['description'],
            ]);
        }

        // Create income categories
        foreach ($incomeCategories as $category) {
            Category::create([
                'user_id' => $user->id,
                'name' => $category['name'],
                'type' => $category['type'],
                'color' => $category['color'],
                'description' => $category['description'],
            ]);
        }
    }

    /**
     * Create test transactions
     */
    private function createTransactions($user): void
    {
        // Get categories
        $groceriesCategory = Category::where('user_id', $user->id)
            ->where('name', 'Groceries')
            ->first();
            
        $rentCategory = Category::where('user_id', $user->id)
            ->where('name', 'Rent')
            ->first();
            
        $transportationCategory = Category::where('user_id', $user->id)
            ->where('name', 'Transportation')
            ->first();
            
        $salaryCategory = Category::where('user_id', $user->id)
            ->where('name', 'Salary')
            ->first();
            
        $freelanceCategory = Category::where('user_id', $user->id)
            ->where('name', 'Freelance')
            ->first();

        // Current month transactions
        $currentMonth = Carbon::now();
        
        // Grocery transactions
        if ($groceriesCategory) {
            // Create 4 grocery transactions for the current month
            for ($i = 0; $i < 4; $i++) {
                $date = clone $currentMonth;
                $date->day = rand(1, $date->daysInMonth);
                
                Transaction::create([
                    'user_id' => $user->id,
                    'category_id' => $groceriesCategory->id,
                    'amount' => rand(1000, 3000) + (rand(0, 99) / 100),
                    'type' => 'expense',
                    'date' => $date,
                    'description' => 'Grocery shopping',
                ]);
            }
        }
        
        // Rent transaction
        if ($rentCategory) {
            $date = clone $currentMonth;
            $date->day = 5; // Rent paid on 5th
            
            Transaction::create([
                'user_id' => $user->id,
                'category_id' => $rentCategory->id,
                'amount' => 25000,
                'type' => 'expense',
                'date' => $date,
                'description' => 'Monthly rent',
            ]);
        }
        
        // Transportation transactions
        if ($transportationCategory) {
            // Create 6 transportation transactions
            for ($i = 0; $i < 6; $i++) {
                $date = clone $currentMonth;
                $date->day = rand(1, $date->daysInMonth);
                
                Transaction::create([
                    'user_id' => $user->id,
                    'category_id' => $transportationCategory->id,
                    'amount' => rand(100, 500) + (rand(0, 99) / 100),
                    'type' => 'expense',
                    'date' => $date,
                    'description' => 'Transportation',
                ]);
            }
        }
        
        // Salary transaction
        if ($salaryCategory) {
            $date = clone $currentMonth;
            $date->day = 1; // Salary on 1st
            
            Transaction::create([
                'user_id' => $user->id,
                'category_id' => $salaryCategory->id,
                'amount' => 75000,
                'type' => 'income',
                'date' => $date,
                'description' => 'Monthly salary',
            ]);
        }
        
        // Freelance transactions
        if ($freelanceCategory) {
            // Create 2 freelance income transactions
            for ($i = 0; $i < 2; $i++) {
                $date = clone $currentMonth;
                $date->day = rand(10, 25);
                
                Transaction::create([
                    'user_id' => $user->id,
                    'category_id' => $freelanceCategory->id,
                    'amount' => rand(5000, 15000) + (rand(0, 99) / 100),
                    'type' => 'income',
                    'date' => $date,
                    'description' => 'Freelance project payment',
                ]);
            }
        }
        
        // Previous month transactions (for testing date filters)
        $previousMonth = Carbon::now()->subMonth();
        
        // Add one transaction of each type in the previous month
        if ($groceriesCategory) {
            $date = clone $previousMonth;
            $date->day = 15;
            
            Transaction::create([
                'user_id' => $user->id,
                'category_id' => $groceriesCategory->id,
                'amount' => 2500,
                'type' => 'expense',
                'date' => $date,
                'description' => 'Previous month grocery',
            ]);
        }
        
        if ($salaryCategory) {
            $date = clone $previousMonth;
            $date->day = 1;
            
            Transaction::create([
                'user_id' => $user->id,
                'category_id' => $salaryCategory->id,
                'amount' => 75000,
                'type' => 'income',
                'date' => $date,
                'description' => 'Previous month salary',
            ]);
        }
    }

    /**
     * Create test budgets
     */
    private function createBudgets($user): void
    {
        // Get expense categories
        $expenseCategories = Category::where('user_id', $user->id)
            ->where('type', 'expense')
            ->get();
            
        // Current month budgets
        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();
        
        foreach ($expenseCategories as $category) {
            // Set budget amount based on category
            $amount = 0;
            
            switch ($category->name) {
                case 'Groceries':
                    $amount = 10000; // ₹10,000
                    break;
                case 'Rent':
                    $amount = 25000; // ₹25,000
                    break;
                case 'Transportation':
                    $amount = 5000; // ₹5,000
                    break;
                default:
                    $amount = 5000; // Default
            }
            
            Budget::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'amount' => $amount,
                'period' => 'monthly',
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);
        }
        
        // Previous month budget (for testing date filters)
        $prevStartDate = Carbon::now()->subMonth()->startOfMonth();
        $prevEndDate = Carbon::now()->subMonth()->endOfMonth();
        
        if ($expenseCategories->isNotEmpty()) {
            $category = $expenseCategories->first();
            
            Budget::create([
                'user_id' => $user->id,
                'category_id' => $category->id,
                'amount' => 8000,
                'period' => 'monthly',
                'start_date' => $prevStartDate,
                'end_date' => $prevEndDate,
            ]);
        }
    }
}