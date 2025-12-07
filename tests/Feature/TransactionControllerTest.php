<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user
        $this->user = User::factory()->create();
        
        // Create a category for the user
        $this->category = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'expense',
            'name' => 'Test Category'
        ]);
    }

    public function test_index_displays_transactions()
    {
        // Create some transactions
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'type' => 'expense'
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('transactions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Transactions/Index')
            ->has('transactions.data', 3)
        );
    }

    public function test_index_filters_transactions_by_category()
    {
        // Create another category
        $anotherCategory = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'expense',
            'name' => 'Another Category'
        ]);

        // Create transactions for both categories
        Transaction::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'type' => 'expense'
        ]);

        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $anotherCategory->id,
            'type' => 'expense'
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('transactions.index', ['category_id' => $this->category->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Transactions/Index')
            ->has('transactions.data', 2)
        );
    }

    public function test_store_creates_new_transaction()
    {
        $transactionData = [
            'category_id' => $this->category->id,
            'amount' => 100,
            'type' => 'expense',
            'date' => now()->format('Y-m-d'),
            'description' => 'Test transaction'
        ];

        $response = $this->actingAs($this->user)
            ->post(route('transactions.store'), $transactionData);

        $response->assertRedirect(route('transactions.index'));
        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'amount' => 100,
            'description' => 'Test transaction'
        ]);
    }

    public function test_update_modifies_transaction()
    {
        // Create a transaction
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id,
            'amount' => 50,
            'type' => 'expense',
            'description' => 'Original description'
        ]);

        $updatedData = [
            'category_id' => $this->category->id,
            'amount' => 75,
            'type' => 'expense',
            'date' => now()->format('Y-m-d'),
            'description' => 'Updated description'
        ];

        $response = $this->actingAs($this->user)
            ->put(route('transactions.update', $transaction), $updatedData);

        $response->assertRedirect(route('transactions.index'));
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'amount' => 75,
            'description' => 'Updated description'
        ]);
    }

    public function test_destroy_deletes_transaction()
    {
        // Create a transaction
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $this->category->id
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('transactions.destroy', $transaction));

        $response->assertRedirect(route('transactions.index'));
        $this->assertDatabaseMissing('transactions', [
            'id' => $transaction->id
        ]);
    }

    public function test_user_cannot_access_other_users_transactions()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create a transaction for the other user
        $transaction = Transaction::factory()->create([
            'user_id' => $anotherUser->id,
            'category_id' => Category::factory()->create([
                'user_id' => $anotherUser->id,
                'type' => 'expense'
            ])->id
        ]);

        // Try to view the transaction
        $response = $this->actingAs($this->user)
            ->get(route('transactions.show', $transaction));

        $response->assertStatus(404);

        // Try to update the transaction
        $response = $this->actingAs($this->user)
            ->put(route('transactions.update', $transaction), [
                'category_id' => $this->category->id,
                'amount' => 100,
                'type' => 'expense',
                'date' => now()->format('Y-m-d')
            ]);

        $response->assertStatus(404);

        // Try to delete the transaction
        $response = $this->actingAs($this->user)
            ->delete(route('transactions.destroy', $transaction));

        $response->assertStatus(404);
    }
}