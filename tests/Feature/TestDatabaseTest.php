<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Budget;

class TestDatabaseTest extends TestCase
{
    /**
     * Test that the test database has been set up correctly.
     */
    public function test_test_database_setup(): void
    {
        // Check that we have the expected users
        $this->assertEquals(2, User::count());
        $this->assertTrue(User::where('email', 'testadmin@example.com')->exists());
        $this->assertTrue(User::where('email', 'testuser@example.com')->exists());
        
        // Get the test user
        $user = $this->getTestUser();
        
        // Check that we have categories
        $this->assertTrue(Category::where('user_id', $user->id)->exists());
        $this->assertGreaterThan(0, Category::where('user_id', $user->id)->count());
        
        // Check that we have transactions
        $this->assertTrue(Transaction::where('user_id', $user->id)->exists());
        $this->assertGreaterThan(0, Transaction::where('user_id', $user->id)->count());
        
        // Check that we have budgets
        $this->assertTrue(Budget::where('user_id', $user->id)->exists());
        $this->assertGreaterThan(0, Budget::where('user_id', $user->id)->count());
    }
    
    /**
     * Test that transactions can be created and retrieved.
     */
    public function test_transaction_functionality(): void
    {
        // Get the test user
        $user = $this->getTestUser();
        
        // Get a category
        $category = Category::where('user_id', $user->id)
            ->where('type', 'expense')
            ->first();
            
        // Create a new transaction
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'amount' => 1500.50,
            'type' => 'expense',
            'date' => now(),
            'description' => 'Test transaction',
        ]);
        
        // Check that the transaction was created
        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'user_id' => $user->id,
            'amount' => 1500.50,
            'description' => 'Test transaction',
        ]);
        
        // Retrieve the transaction
        $retrievedTransaction = Transaction::find($transaction->id);
        
        // Check that the retrieved transaction matches the created one
        $this->assertEquals($transaction->id, $retrievedTransaction->id);
        $this->assertEquals($user->id, $retrievedTransaction->user_id);
        $this->assertEquals($category->id, $retrievedTransaction->category_id);
        $this->assertEqualsWithDelta(1500.50, (float)$retrievedTransaction->amount, 0.51);
        $this->assertEquals('expense', $retrievedTransaction->type);
        $this->assertEquals('Test transaction', $retrievedTransaction->description);
    }
}