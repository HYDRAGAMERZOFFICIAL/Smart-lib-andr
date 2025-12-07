# Testing Guide for PERAFINCORE

This document provides comprehensive information about testing the PERAFINCORE application, including setup, running tests, and best practices.

## Table of Contents

1. [Testing Environment Setup](#testing-environment-setup)
2. [Test Database Configuration](#test-database-configuration)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Test Data and Seeders](#test-data-and-seeders)
6. [Mocking and Faking](#mocking-and-faking)
7. [Continuous Integration](#continuous-integration)
8. [Troubleshooting](#troubleshooting)

## Testing Environment Setup

PERAFINCORE uses PHPUnit for testing, which is already included in Laravel's default dependencies.

### Prerequisites

- PHP 8.1 or higher
- MySQL 5.7 or higher
- Composer

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/PERAFINCORE.git
   cd PERAFINCORE
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Copy the testing environment file:
   ```bash
   cp .env.example .env.testing
   ```

4. Generate an application key for testing:
   ```bash
   php artisan key:generate --env=testing
   ```

## Test Database Configuration

PERAFINCORE uses a separate database for testing to ensure that your development or production data is not affected by tests.

### Setting Up the Test Database

1. Create a test database:
   ```sql
   CREATE DATABASE finance_testing;
   ```

2. Configure the `.env.testing` file:
   ```
   APP_ENV=testing
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=finance_testing
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. Update `phpunit.xml` to use the test database:
   ```xml
   <php>
       <env name="APP_ENV" value="testing"/>
       <env name="DB_CONNECTION" value="mysql"/>
       <env name="DB_DATABASE" value="finance_testing"/>
       <!-- Other environment variables -->
   </php>
   ```

### Database Migrations and Seeders

The test database is automatically migrated and seeded before each test run using the `RefreshDatabase` trait in the base `TestCase` class.

## Running Tests

### Running All Tests

To run all tests:

```bash
php artisan test
```

### Running Specific Test Files

To run a specific test file:

```bash
php artisan test tests/Feature/TransactionTest.php
```

### Running Specific Test Methods

To run a specific test method:

```bash
php artisan test --filter test_user_can_create_transaction
```

### Running Tests with Coverage Report

To generate a code coverage report:

```bash
php artisan test --coverage
```

For a detailed HTML coverage report:

```bash
XDEBUG_MODE=coverage php artisan test --coverage-html reports/
```

Note: This requires Xdebug to be installed and configured.

## Writing Tests

PERAFINCORE follows Laravel's testing conventions with two main types of tests:

1. **Unit Tests**: Located in `tests/Unit/`, these test individual components in isolation.
2. **Feature Tests**: Located in `tests/Feature/`, these test the application's features and endpoints.

### Test Case Structure

A typical test case follows this structure:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class ExampleTest extends TestCase
{
    /**
     * Test description.
     */
    public function test_example(): void
    {
        // Arrange: Set up the test data
        $user = $this->getTestUser();
        
        // Act: Perform the action being tested
        $this->actingAs($user);
        $response = $this->get('/dashboard');
        
        // Assert: Verify the expected outcome
        $response->assertStatus(200);
    }
}
```

### Authentication in Tests

To test as an authenticated user:

```php
$user = $this->getTestUser(); // Helper method in TestCase
$this->actingAs($user);
```

To test as an admin:

```php
$admin = $this->getTestUser('admin');
$this->actingAs($admin);
```

### Testing API Endpoints

For API tests:

```php
$response = $this->getJson('/api/transactions');
$response->assertStatus(200)
         ->assertJsonStructure([
             'data' => [
                 '*' => ['id', 'amount', 'description']
             ]
         ]);
```

## Test Data and Seeders

PERAFINCORE uses a dedicated seeder for tests to ensure consistent test data.

### TestDatabaseSeeder

The `TestDatabaseSeeder` creates:
- Admin and regular users
- Categories for expense and income
- Transactions with various types and amounts
- Budgets for different periods

### Using the Test Seeder

The seeder is automatically run by the `setUp` method in the base `TestCase` class:

```php
protected function setUp(): void
{
    parent::setUp();
    $this->artisan('migrate:fresh');
    $this->seed(TestDatabaseSeeder::class);
}
```

### Creating Custom Test Data

For tests that need specific data:

```php
// Create a transaction for testing
$transaction = Transaction::create([
    'user_id' => $user->id,
    'category_id' => $category->id,
    'amount' => 1500.50,
    'type' => 'expense',
    'date' => now(),
    'description' => 'Test transaction',
]);
```

## Mocking and Faking

### Mocking Services

Use Laravel's built-in mocking capabilities:

```php
$this->mock(PaymentGateway::class, function ($mock) {
    $mock->shouldReceive('process')
         ->once()
         ->andReturn(true);
});
```

### Faking Notifications

```php
Notification::fake();

// Perform action that triggers notification...

Notification::assertSentTo(
    $user,
    TransactionCreatedNotification::class
);
```

### Faking Events

```php
Event::fake();

// Perform action that triggers event...

Event::assertDispatched(TransactionCreated::class);
```

## Continuous Integration

PERAFINCORE can be configured to run tests automatically on each commit using GitHub Actions or other CI services.

### GitHub Actions Configuration

A basic GitHub Actions workflow for testing:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: finance_testing
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        extensions: mbstring, dom, fileinfo, mysql
        coverage: xdebug
    
    - name: Install Dependencies
      run: composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
    
    - name: Copy .env.testing
      run: cp .env.example .env.testing
    
    - name: Generate key
      run: php artisan key:generate --env=testing
    
    - name: Run Tests
      run: php artisan test
```

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

If tests fail with database connection errors:

1. Verify that the test database exists:
   ```bash
   mysql -u root -e "SHOW DATABASES;"
   ```

2. Check the database credentials in `.env.testing` and `phpunit.xml`.

3. Ensure MySQL service is running:
   ```bash
   sudo service mysql status
   ```

#### Memory Limit Errors

If you encounter memory limit errors:

1. Increase PHP memory limit in `php.ini`:
   ```
   memory_limit = 512M
   ```

2. Run tests with increased memory:
   ```bash
   php -d memory_limit=512M artisan test
   ```

#### Slow Tests

If tests are running slowly:

1. Use database transactions instead of migrations when possible:
   ```php
   use Illuminate\Foundation\Testing\DatabaseTransactions;
   
   class MyTest extends TestCase
   {
       use DatabaseTransactions;
       
       // Test methods...
   }
   ```

2. Run tests in parallel (requires PHPUnit 9.5+):
   ```bash
   php artisan test --parallel
   ```

### Getting Help

If you encounter issues not covered here:

1. Check the Laravel documentation: https://laravel.com/docs/10.x/testing
2. Search the GitHub issues: https://github.com/yourusername/PERAFINCORE/issues
3. Ask for help in the project's communication channels

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests.
2. **Descriptive Names**: Use descriptive test method names that explain what is being tested.
3. **Arrange-Act-Assert**: Structure tests with clear arrangement, action, and assertion phases.
4. **Test Edge Cases**: Don't just test the happy path; test edge cases and error conditions.
5. **Keep Tests Fast**: Optimize tests to run quickly to encourage frequent testing.
6. **Test Coverage**: Aim for high test coverage, especially for critical business logic.
7. **Refactor Tests**: Refactor tests as you refactor code to maintain test quality.