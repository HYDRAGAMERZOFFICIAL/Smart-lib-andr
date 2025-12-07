# PHPUnit Testing Quick Reference

This quick reference guide provides common commands and patterns for testing the PERAFINCORE application.

## Running Tests

### Basic Commands

```bash
# Run all tests
php artisan test

# Run a specific test file
php artisan test tests/Feature/TransactionTest.php

# Run a specific test method
php artisan test --filter test_user_can_create_transaction

# Run tests with coverage report
php artisan test --coverage

# Run tests with detailed HTML coverage report
XDEBUG_MODE=coverage php artisan test --coverage-html reports/

# Run tests in parallel
php artisan test --parallel
```

### Running Tests by Group

```bash
# Run all feature tests
php artisan test tests/Feature

# Run all unit tests
php artisan test tests/Unit

# Run tests with a specific group tag
php artisan test --group transactions
```

## Test Database Setup

```bash
# Create the test database
mysql -u root -e "CREATE DATABASE finance_testing;"

# Generate application key for testing
php artisan key:generate --env=testing

# Manually migrate the test database
php artisan migrate:fresh --env=testing

# Seed the test database
php artisan db:seed --class=TestDatabaseSeeder --env=testing
```

## Common Assertions

```php
// Basic assertions
$this->assertTrue($condition);
$this->assertFalse($condition);
$this->assertEquals($expected, $actual);
$this->assertNotEquals($expected, $actual);

// Numeric assertions
$this->assertGreaterThan($expected, $actual);
$this->assertLessThan($expected, $actual);
$this->assertEqualsWithDelta($expected, $actual, $delta);

// String assertions
$this->assertStringContains($needle, $haystack);
$this->assertStringStartsWith($prefix, $string);
$this->assertStringEndsWith($suffix, $string);

// Array assertions
$this->assertCount($expectedCount, $array);
$this->assertArrayHasKey($key, $array);
$this->assertContains($needle, $haystack);

// Database assertions
$this->assertDatabaseHas($table, $data);
$this->assertDatabaseMissing($table, $data);
$this->assertDatabaseCount($table, $count);

// Response assertions
$response->assertStatus(200);
$response->assertRedirect($uri);
$response->assertJson($data);
$response->assertJsonStructure($structure);
$response->assertViewIs($viewName);
$response->assertViewHas($key, $value);
```

## Authentication in Tests

```php
// Act as a user
$user = $this->getTestUser();
$this->actingAs($user);

// Act as an admin
$admin = $this->getTestUser('admin');
$this->actingAs($admin);

// Test authentication requirements
$response = $this->get('/dashboard');
$response->assertRedirect('/login');
```

## Testing Forms

```php
// Testing form submission
$response = $this->post('/transactions', [
    'category_id' => 1,
    'amount' => 1500.50,
    'type' => 'expense',
    'date' => now()->format('Y-m-d'),
    'description' => 'Test transaction',
]);

// Testing form validation errors
$response = $this->post('/transactions', [
    // Missing required fields
]);
$response->assertSessionHasErrors(['category_id', 'amount', 'type', 'date']);

// Testing file uploads
$response = $this->post('/upload', [
    'document' => UploadedFile::fake()->create('document.pdf', 100),
]);
```

## Testing JSON APIs

```php
// GET request
$response = $this->getJson('/api/transactions');
$response->assertStatus(200)
         ->assertJsonStructure([
             'data' => [
                 '*' => ['id', 'amount', 'description']
             ]
         ]);

// POST request
$response = $this->postJson('/api/transactions', [
    'category_id' => 1,
    'amount' => 1500.50,
    'type' => 'expense',
    'date' => now()->format('Y-m-d'),
    'description' => 'API test',
]);
$response->assertStatus(201);

// Testing API authentication
$response = $this->getJson('/api/user');
$response->assertStatus(401); // Unauthorized

$response = $this->withHeaders([
    'Authorization' => 'Bearer ' . $token,
])->getJson('/api/user');
$response->assertStatus(200);
```

## Mocking and Faking

```php
// Mock a service
$this->mock(PaymentService::class, function ($mock) {
    $mock->shouldReceive('process')
         ->once()
         ->andReturn(true);
});

// Fake notifications
Notification::fake();
// Perform action...
Notification::assertSentTo($user, TransactionNotification::class);

// Fake events
Event::fake();
// Perform action...
Event::assertDispatched(TransactionCreated::class);

// Fake mail
Mail::fake();
// Perform action...
Mail::assertSent(TransactionReceipt::class);

// Fake HTTP requests
Http::fake([
    'example.com/*' => Http::response(['success' => true], 200),
]);
```

## Test Data Helpers

```php
// Create a user for testing
$user = User::factory()->create();

// Create a user with specific attributes
$user = User::factory()->create([
    'name' => 'Test User',
    'email' => 'test@example.com',
]);

// Create multiple records
$users = User::factory()->count(3)->create();

// Create related records
$user = User::factory()
    ->has(Transaction::factory()->count(3))
    ->create();
```

## Debugging Tests

```php
// Dump and die
$this->dump($variable);
$this->dd($variable);

// Dump response
$response = $this->get('/dashboard');
$response->dump();
$response->dumpHeaders();
$response->dumpSession();

// View rendered content
$response = $this->get('/dashboard');
echo $response->getContent();
```

## Common Testing Patterns

### Setup and Teardown

```php
protected function setUp(): void
{
    parent::setUp();
    // Additional setup
}

protected function tearDown(): void
{
    // Custom teardown
    parent::tearDown();
}
```

### Data Providers

```php
/**
 * @dataProvider provideTransactionData
 */
public function test_transaction_validation($data, $shouldPass): void
{
    // Test implementation
}

public function provideTransactionData(): array
{
    return [
        'valid transaction' => [
            [
                'category_id' => 1,
                'amount' => 100,
                'type' => 'expense',
                'date' => '2023-01-01',
                'description' => 'Test',
            ],
            true
        ],
        'missing amount' => [
            [
                'category_id' => 1,
                'type' => 'expense',
                'date' => '2023-01-01',
                'description' => 'Test',
            ],
            false
        ],
        // More test cases...
    ];
}
```

### Custom Assertions

```php
/**
 * Assert that a transaction has the expected attributes.
 */
protected function assertTransactionValid($transaction, $expectedData): void
{
    $this->assertEquals($expectedData['amount'], $transaction->amount);
    $this->assertEquals($expectedData['type'], $transaction->type);
    $this->assertEquals($expectedData['description'], $transaction->description);
    // More assertions...
}
```

## Troubleshooting

### Test Database Issues

If tests are failing due to database issues:

1. Ensure the test database exists:
   ```bash
   mysql -u root -e "CREATE DATABASE finance_testing;"
   ```

2. Check database configuration in `.env.testing` and `phpunit.xml`.

3. Try manually migrating the test database:
   ```bash
   php artisan migrate:fresh --env=testing
   ```

### Memory Limit Errors

If you encounter memory limit errors:

```bash
php -d memory_limit=512M artisan test
```

### Slow Tests

If tests are running slowly:

1. Use database transactions instead of migrations:
   ```php
   use Illuminate\Foundation\Testing\DatabaseTransactions;
   ```

2. Run tests in parallel:
   ```bash
   php artisan test --parallel
   ```

3. Focus on specific tests:
   ```bash
   php artisan test --filter=TransactionTest
   ```