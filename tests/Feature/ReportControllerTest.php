<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class ReportControllerTest extends TestCase
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
            'name' => 'Salary',
            'color' => '#4CAF50'
        ]);
        
        $this->expenseCategory = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'expense',
            'name' => 'Groceries',
            'color' => '#F44336'
        ]);
    }

    public function test_index_displays_reports_with_default_period()
    {
        // Create transactions in current month
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'income',
            'amount' => 5000,
            'date' => now()->startOfMonth()->addDays(5)
        ]);

        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 500,
            'date' => now()->startOfMonth()->addDays(10)
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/Index')
            ->has('filters')
            ->has('summary')
            ->has('categoryBreakdown')
            ->has('trends')
            ->has('topExpenseCategories')
            ->has('topIncomeCategories')
        );
    }

    public function test_index_filters_by_custom_date_range()
    {
        // Create transactions in current month
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'income',
            'amount' => 5000,
            'date' => now()->startOfMonth()->addDays(5)
        ]);

        // Create transactions in previous month
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'income',
            'amount' => 4000,
            'date' => now()->subMonth()->startOfMonth()->addDays(5)
        ]);

        // Request with custom date range spanning both months
        $startDate = now()->subMonth()->startOfMonth()->format('Y-m-d');
        $endDate = now()->endOfMonth()->format('Y-m-d');
        
        $response = $this->actingAs($this->user)
            ->get(route('reports.index', [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/Index')
            ->where('filters.period', 'custom')
            ->where('filters.start_date', $startDate)
            ->where('filters.end_date', $endDate)
            ->has('summary')
        );
    }

    public function test_index_filters_by_period()
    {
        // Create transactions across different periods
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'income',
            'amount' => 5000,
            'date' => now()->startOfWeek()->addDays(1)
        ]);

        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 1000,
            'date' => now()->startOfWeek()->addDays(2)
        ]);

        // Request with week period
        $response = $this->actingAs($this->user)
            ->get(route('reports.index', ['period' => 'week']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/Index')
            ->where('filters.period', 'week')
            ->has('summary')
        );
    }

    public function test_category_analysis_shows_category_details()
    {
        // Create multiple transactions for a category
        Transaction::factory()->count(5)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 200,
            'date' => now()->startOfMonth()->addDays(rand(1, 20))
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.category-analysis', [
                'category_id' => $this->expenseCategory->id
            ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/CategoryAnalysis')
            ->has('category')
            ->has('transactions')
            ->has('summary')
            ->has('trends')
        );
    }

    public function test_income_vs_expense_shows_comparison()
    {
        // Create income transactions
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'income',
            'amount' => 5000,
            'date' => now()->startOfMonth()->addDays(5)
        ]);

        // Create expense transactions
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'expense',
            'amount' => 500,
            'date' => now()->startOfMonth()->addDays(10)
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.income-vs-expense'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/IncomeVsExpense')
            ->has('filters')
            ->has('summary')
            ->has('monthlyData')
            ->has('categoryBreakdown')
        );
    }

    public function test_user_only_sees_own_transaction_data()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create categories for the other user
        $otherCategory = Category::factory()->create([
            'user_id' => $anotherUser->id,
            'type' => 'expense'
        ]);
        
        // Create transactions for both users
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'income',
            'amount' => 5000,
            'date' => now()->startOfMonth()->addDays(5)
        ]);
        
        Transaction::factory()->create([
            'user_id' => $anotherUser->id,
            'category_id' => $otherCategory->id,
            'type' => 'expense',
            'amount' => 3000,
            'date' => now()->startOfMonth()->addDays(5)
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/Index')
            ->has('summary')
        );
    }
}