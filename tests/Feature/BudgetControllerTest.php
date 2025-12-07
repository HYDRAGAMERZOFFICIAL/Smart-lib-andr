<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class BudgetControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user
        $this->user = User::factory()->create();
        
        // Create an expense category for the user
        $this->category = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'expense',
            'name' => 'Test Category'
        ]);
    }

    public function test_index_displays_budgets()
    {
        // Create some budgets
        Budget::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'period' => 'monthly'
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('budgets.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Budgets/Index')
            ->has('budgets', 3)
        );
    }

    public function test_store_creates_new_budget()
    {
        $budgetData = [
            'category_id' => $this->category->id,
            'amount' => 1000,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->format('Y-m-d')
        ];

        $response = $this->actingAs($this->user)
            ->post(route('budgets.store'), $budgetData);

        $response->assertRedirect(route('budgets.index'));
        $this->assertDatabaseHas('budgets', [
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'amount' => 1000,
            'period' => 'monthly'
        ]);
    }

    public function test_cannot_create_overlapping_budget()
    {
        // Create an existing budget
        Budget::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'period' => 'monthly'
        ]);

        // Try to create an overlapping budget
        $budgetData = [
            'category_id' => $this->category->id,
            'amount' => 1000,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth()->addDays(5)->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->addDays(5)->format('Y-m-d')
        ];

        $response = $this->actingAs($this->user)
            ->post(route('budgets.store'), $budgetData);

        $response->assertSessionHasErrors('category_id');
    }

    public function test_update_modifies_budget()
    {
        // Create a budget
        $budget = Budget::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'amount' => 500,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth()
        ]);

        $updatedData = [
            'category_id' => $this->category->id,
            'amount' => 750,
            'period' => 'monthly',
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->format('Y-m-d')
        ];

        $response = $this->actingAs($this->user)
            ->put(route('budgets.update', $budget), $updatedData);

        $response->assertRedirect(route('budgets.index'));
        $this->assertDatabaseHas('budgets', [
            'id' => $budget->id,
            'amount' => 750
        ]);
    }

    public function test_destroy_deletes_budget()
    {
        // Create a budget
        $budget = Budget::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('budgets.destroy', $budget));

        $response->assertRedirect(route('budgets.index'));
        $this->assertDatabaseMissing('budgets', [
            'id' => $budget->id
        ]);
    }

    public function test_show_displays_budget_with_transactions()
    {
        // Create a budget
        $budget = Budget::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'amount' => 1000,
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth()
        ]);

        // Create some transactions for this budget's category within the budget period
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'type' => 'expense',
            'amount' => 100,
            'date' => now()->startOfMonth()->addDays(5)
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('budgets.show', $budget));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Budgets/Show')
            ->has('budget')
            ->has('transactions', 3)
            ->has('stats')
        );
    }

    public function test_summary_returns_budget_summary()
    {
        // Create active budgets
        Budget::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'start_date' => now()->subDays(5),
            'end_date' => now()->addDays(5),
            'amount' => 1000
        ]);

        // Create a budget that's over budget
        $overBudget = Budget::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'start_date' => now()->subDays(5),
            'end_date' => now()->addDays(5),
            'amount' => 100
        ]);

        // Create transactions that exceed the budget
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'type' => 'expense',
            'amount' => 150,
            'date' => now()
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('budgets.summary'));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'activeBudgets',
            'overBudgetCount',
            'warningCount',
            'topBudgets'
        ]);
        
        $response->assertJson([
            'activeBudgets' => 3,
            'overBudgetCount' => 1
        ]);
    }

    public function test_analytics_returns_budget_analytics()
    {
        // Create active budgets
        Budget::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'start_date' => now()->subDays(5),
            'end_date' => now()->addDays(5),
            'amount' => 1000
        ]);

        // Create transactions
        Transaction::factory()->count(5)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'type' => 'expense',
            'amount' => 100,
            'date' => now()
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('budgets.analytics'));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'budgetStats' => [
                'totalBudgeted',
                'totalSpent',
                'overallProgress',
                'activeBudgets',
                'overBudgetCount',
                'warningCount'
            ],
            'topBudgets',
            'topCategories',
            'monthlyTrend'
        ]);
    }

    public function test_user_cannot_access_other_users_budgets()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create a category for the other user
        $otherCategory = Category::factory()->create([
            'user_id' => $anotherUser->id,
            'type' => 'expense'
        ]);
        
        // Create a budget for the other user
        $budget = Budget::factory()->create([
            'user_id' => $anotherUser->id,
            'category_id' => $otherCategory->id
        ]);

        // Try to view the budget
        $response = $this->actingAs($this->user)
            ->get(route('budgets.show', $budget));

        $response->assertStatus(404);

        // Try to update the budget
        $response = $this->actingAs($this->user)
            ->put(route('budgets.update', $budget), [
                'category_id' => $this->category->id,
                'amount' => 1000,
                'period' => 'monthly',
                'start_date' => now()->startOfMonth()->format('Y-m-d'),
                'end_date' => now()->endOfMonth()->format('Y-m-d')
            ]);

        $response->assertStatus(404);

        // Try to delete the budget
        $response = $this->actingAs($this->user)
            ->delete(route('budgets.destroy', $budget));

        $response->assertStatus(404);
    }
}