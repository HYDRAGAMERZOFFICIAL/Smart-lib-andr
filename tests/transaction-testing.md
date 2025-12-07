# Transaction Testing Guide for PERAFINCORE

This guide focuses specifically on testing transaction functionality in the PERAFINCORE application, providing examples and best practices.

## Table of Contents

1. [Transaction Model Testing](#transaction-model-testing)
2. [Transaction Controller Testing](#transaction-controller-testing)
3. [Transaction API Testing](#transaction-api-testing)
4. [Transaction Validation Testing](#transaction-validation-testing)
5. [Transaction Business Logic Testing](#transaction-business-logic-testing)
6. [Transaction Reporting Testing](#transaction-reporting-testing)

## Transaction Model Testing

### Testing Transaction Creation

```php
public function test_can_create_transaction(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1500.50,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Test transaction',
    ]);
    
    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'user_id' => $user->id,
        'amount' => 1500.50,
        'description' => 'Test transaction',
    ]);
}
```

### Testing Transaction Relationships

```php
public function test_transaction_belongs_to_user(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Test relationship',
    ]);
    
    $this->assertInstanceOf(User::class, $transaction->user);
    $this->assertEquals($user->id, $transaction->user->id);
}

public function test_transaction_belongs_to_category(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Test relationship',
    ]);
    
    $this->assertInstanceOf(Category::class, $transaction->category);
    $this->assertEquals($category->id, $transaction->category->id);
}
```

### Testing Transaction Scopes and Queries

```php
public function test_transaction_scope_by_type(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    // Create expense transaction
    Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Expense transaction',
    ]);
    
    // Create income transaction
    Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 2000,
        'type' => 'income',
        'date' => now(),
        'description' => 'Income transaction',
    ]);
    
    $expenses = Transaction::where('user_id', $user->id)->expense()->get();
    $incomes = Transaction::where('user_id', $user->id)->income()->get();
    
    $this->assertGreaterThan(0, $expenses->count());
    $this->assertGreaterThan(0, $incomes->count());
    
    foreach ($expenses as $expense) {
        $this->assertEquals('expense', $expense->type);
    }
    
    foreach ($incomes as $income) {
        $this->assertEquals('income', $income->type);
    }
}
```

## Transaction Controller Testing

### Testing Transaction Index

```php
public function test_transaction_index_displays_transactions(): void
{
    $user = $this->getTestUser();
    $this->actingAs($user);
    
    $response = $this->get(route('transactions.index'));
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($assert) => $assert
        ->component('Transactions/Index')
        ->has('transactions')
    );
}
```

### Testing Transaction Creation

```php
public function test_can_create_transaction_through_controller(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $this->actingAs($user);
    
    $response = $this->post(route('transactions.store'), [
        'category_id' => $category->id,
        'amount' => 1500.50,
        'type' => 'expense',
        'date' => now()->format('Y-m-d'),
        'description' => 'Controller test transaction',
    ]);
    
    $response->assertRedirect();
    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1500.50,
        'description' => 'Controller test transaction',
    ]);
}
```

### Testing Transaction Update

```php
public function test_can_update_transaction(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Original description',
    ]);
    
    $this->actingAs($user);
    
    $response = $this->put(route('transactions.update', $transaction), [
        'category_id' => $category->id,
        'amount' => 2000,
        'type' => 'expense',
        'date' => now()->format('Y-m-d'),
        'description' => 'Updated description',
    ]);
    
    $response->assertRedirect();
    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'amount' => 2000,
        'description' => 'Updated description',
    ]);
}
```

### Testing Transaction Deletion

```php
public function test_can_delete_transaction(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $transaction = Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Transaction to delete',
    ]);
    
    $this->actingAs($user);
    
    $response = $this->delete(route('transactions.destroy', $transaction));
    
    $response->assertRedirect();
    $this->assertDatabaseMissing('transactions', [
        'id' => $transaction->id,
    ]);
}
```

## Transaction API Testing

If your application has an API for transactions, you can test it like this:

```php
public function test_api_can_list_transactions(): void
{
    $user = $this->getTestUser();
    $this->actingAs($user);
    
    $response = $this->getJson('/api/transactions');
    
    $response->assertStatus(200)
             ->assertJsonStructure([
                 'data' => [
                     '*' => ['id', 'amount', 'description', 'type', 'date']
                 ]
             ]);
}

public function test_api_can_create_transaction(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $this->actingAs($user);
    
    $response = $this->postJson('/api/transactions', [
        'category_id' => $category->id,
        'amount' => 1500.50,
        'type' => 'expense',
        'date' => now()->format('Y-m-d'),
        'description' => 'API test transaction',
    ]);
    
    $response->assertStatus(201)
             ->assertJson([
                 'data' => [
                     'amount' => 1500.50,
                     'description' => 'API test transaction',
                 ]
             ]);
             
    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'description' => 'API test transaction',
    ]);
}
```

## Transaction Validation Testing

### Testing Required Fields

```php
public function test_transaction_requires_category(): void
{
    $user = $this->getTestUser();
    $this->actingAs($user);
    
    $response = $this->post(route('transactions.store'), [
        'amount' => 1500.50,
        'type' => 'expense',
        'date' => now()->format('Y-m-d'),
        'description' => 'Test transaction',
    ]);
    
    $response->assertSessionHasErrors('category_id');
}

public function test_transaction_requires_amount(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $this->actingAs($user);
    
    $response = $this->post(route('transactions.store'), [
        'category_id' => $category->id,
        'type' => 'expense',
        'date' => now()->format('Y-m-d'),
        'description' => 'Test transaction',
    ]);
    
    $response->assertSessionHasErrors('amount');
}
```

### Testing Validation Rules

```php
public function test_transaction_amount_must_be_numeric(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $this->actingAs($user);
    
    $response = $this->post(route('transactions.store'), [
        'category_id' => $category->id,
        'amount' => 'not-a-number',
        'type' => 'expense',
        'date' => now()->format('Y-m-d'),
        'description' => 'Test transaction',
    ]);
    
    $response->assertSessionHasErrors('amount');
}

public function test_transaction_type_must_be_valid(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    $this->actingAs($user);
    
    $response = $this->post(route('transactions.store'), [
        'category_id' => $category->id,
        'amount' => 1500.50,
        'type' => 'invalid-type',
        'date' => now()->format('Y-m-d'),
        'description' => 'Test transaction',
    ]);
    
    $response->assertSessionHasErrors('type');
}
```

## Transaction Business Logic Testing

### Testing Transaction Totals

```php
public function test_can_calculate_expense_total(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)
        ->where('type', 'expense')
        ->first();
    
    // Create multiple expense transactions
    Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Expense 1',
    ]);
    
    Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 2000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'Expense 2',
    ]);
    
    // Calculate total expenses
    $totalExpenses = Transaction::where('user_id', $user->id)
        ->where('type', 'expense')
        ->sum('amount');
    
    // Assert the total is correct
    $this->assertGreaterThanOrEqual(3000, $totalExpenses);
}
```

### Testing Date Range Filtering

```php
public function test_can_filter_transactions_by_date_range(): void
{
    $user = $this->getTestUser();
    $category = Category::where('user_id', $user->id)->first();
    
    // Create transaction for last month
    Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 1000,
        'type' => 'expense',
        'date' => now()->subMonth(),
        'description' => 'Last month transaction',
    ]);
    
    // Create transaction for this month
    Transaction::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'amount' => 2000,
        'type' => 'expense',
        'date' => now(),
        'description' => 'This month transaction',
    ]);
    
    // Filter transactions for this month
    $startOfMonth = now()->startOfMonth();
    $endOfMonth = now()->endOfMonth();
    
    $thisMonthTransactions = Transaction::where('user_id', $user->id)
        ->whereBetween('date', [$startOfMonth, $endOfMonth])
        ->get();
    
    // Assert only this month's transaction is included
    $this->assertGreaterThanOrEqual(1, $thisMonthTransactions->count());
    foreach ($thisMonthTransactions as $transaction) {
        $transactionDate = new \DateTime($transaction->date);
        $this->assertTrue($transactionDate >= $startOfMonth && $transactionDate <= $endOfMonth);
    }
}
```

## Transaction Reporting Testing

### Testing Monthly Summary

```php
public function test_can_generate_monthly_summary(): void
{
    $user = $this->getTestUser();
    
    // Get the current month's transactions
    $startOfMonth = now()->startOfMonth();
    $endOfMonth = now()->endOfMonth();
    
    $monthlyExpenses = Transaction::where('user_id', $user->id)
        ->where('type', 'expense')
        ->whereBetween('date', [$startOfMonth, $endOfMonth])
        ->sum('amount');
        
    $monthlyIncome = Transaction::where('user_id', $user->id)
        ->where('type', 'income')
        ->whereBetween('date', [$startOfMonth, $endOfMonth])
        ->sum('amount');
    
    // Calculate balance
    $balance = $monthlyIncome - $monthlyExpenses;
    
    // Assert the values are numeric
    $this->assertIsNumeric($monthlyExpenses);
    $this->assertIsNumeric($monthlyIncome);
    $this->assertIsNumeric($balance);
}
```

### Testing Category Breakdown

```php
public function test_can_generate_category_breakdown(): void
{
    $user = $this->getTestUser();
    
    // Get expenses grouped by category
    $categoryBreakdown = Transaction::where('user_id', $user->id)
        ->where('type', 'expense')
        ->selectRaw('category_id, sum(amount) as total')
        ->groupBy('category_id')
        ->get();
    
    // Assert we have category data
    $this->assertGreaterThan(0, $categoryBreakdown->count());
    
    // Assert each category has a total
    foreach ($categoryBreakdown as $category) {
        $this->assertIsNumeric($category->total);
        $this->assertGreaterThan(0, $category->total);
    }
}
```

## Tips for Effective Transaction Testing

1. **Use Real-World Scenarios**: Create tests that mimic real user behavior, such as creating multiple transactions of different types.

2. **Test Edge Cases**: Test with zero amounts, very large amounts, and transactions at the boundaries of date ranges.

3. **Test Authorization**: Ensure users can only access and modify their own transactions.

4. **Test Data Integrity**: Verify that transaction totals and balances are calculated correctly.

5. **Test Performance**: For applications with many transactions, test the performance of queries and reports.

6. **Test Import/Export**: If your application supports importing or exporting transactions, test these features thoroughly.

7. **Test Recurring Transactions**: If you have recurring transaction functionality, test that transactions are created correctly on schedule.

## Conclusion

Thorough testing of transaction functionality is crucial for a financial application like PERAFINCORE. By following the examples in this guide, you can ensure that your transaction features work correctly and reliably.