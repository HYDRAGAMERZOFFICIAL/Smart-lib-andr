<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Budget;
use App\Models\Goal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $incomeCategory;
    protected $expenseCategory;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user
        $this->user = User::factory()->create();
        
        // Create categories
        $this->incomeCategory = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'income',
            'name' => 'Salary'
        ]);
        
        $this->expenseCategory = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'expense',
            'name' => 'Groceries'
        ]);
    }

    public function test_dashboard_displays_with_default_data()
    {
        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('recentTransactions')
            ->has('filteredTransactions')
            ->has('periodIncome')
            ->has('periodExpense')
            ->has('periodSavings')
            ->has('savingsRate')
            ->has('categoryTotals')
            ->has('budgetStats')
            ->has('topBudgets')
            ->has('dateRange')
            ->has('goalStats')
            ->has('upcomingGoals')
        );
    }

    public function test_dashboard_shows_correct_financial_summary()
    {
        // Create income transactions
        Transaction::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'income',
            'amount' => 1000,
            'date' => now()->startOfMonth()->addDays(5)
        ]);

        // Create expense transactions
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 200,
            'date' => now()->startOfMonth()->addDays(10)
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('periodIncome')
            ->has('periodExpense')
            ->has('periodSavings')
            ->has('savingsRate')
        );
    }

    public function test_dashboard_filters_transactions_by_date_range()
    {
        // Create transactions in current month
        Transaction::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 100,
            'date' => now()->startOfMonth()->addDays(5)
        ]);

        // Create transactions in previous month
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 100,
            'date' => now()->subMonth()->startOfMonth()->addDays(5)
        ]);

        // Request with current month date range (default)
        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('filteredTransactions')
            ->has('periodExpense')
        );

        // Request with previous month date range
        $prevMonthStart = now()->subMonth()->startOfMonth()->format('Y-m-d');
        $prevMonthEnd = now()->subMonth()->endOfMonth()->format('Y-m-d');
        
        $response = $this->actingAs($this->user)
            ->get(route('dashboard', [
                'start_date' => $prevMonthStart,
                'end_date' => $prevMonthEnd
            ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('filteredTransactions')
            ->has('periodExpense')
        );
    }

    public function test_dashboard_shows_budget_information()
    {
        // Create active budgets
        Budget::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'amount' => 1000
        ]);

        // Create an over-budget situation
        $overBudget = Budget::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'amount' => 100
        ]);

        // Create transactions that exceed the budget
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 150,
            'date' => now()
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('budgetStats.activeBudgets', 3)
            ->where('budgetStats.overBudgetCount', 1)
            ->has('topBudgets', 3)
        );
    }

    public function test_dashboard_shows_goal_information()
    {
        // Create active goals
        Goal::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'status' => 'in_progress',
            'target_date' => now()->addMonths(3)
        ]);

        // Create completed goals
        Goal::factory()->count(1)->create([
            'user_id' => $this->user->id,
            'status' => 'completed',
            'target_date' => now()->subMonth()
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('goalStats.activeGoals', 2)
            ->where('goalStats.completedGoals', 1)
            ->where('goalStats.totalGoals', 3)
            ->has('upcomingGoals', 2)
        );
    }

    public function test_dashboard_only_shows_user_own_data()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create categories for the other user
        $otherCategory = Category::factory()->create([
            'user_id' => $anotherUser->id,
            'type' => 'expense'
        ]);
        
        // Create transactions for both users
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 100
        ]);
        
        Transaction::factory()->count(2)->create([
            'user_id' => $anotherUser->id,
            'category_id' => $otherCategory->id,
            'type' => 'expense',
            'amount' => 200
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('recentTransactions')
            ->has('periodExpense')
        );
    }
}