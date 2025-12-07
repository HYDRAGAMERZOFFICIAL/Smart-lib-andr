<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\TestDatabaseSeeder;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;
    
    /**
     * Set up the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Run migrations for the test database
        $this->artisan('migrate:fresh');
        
        // Seed the test database with our test data
        $this->seed(TestDatabaseSeeder::class);
    }
    
    /**
     * Get a test user for authentication tests.
     *
     * @param string $role The role of the user to get (admin or member)
     * @return \App\Models\User
     */
    protected function getTestUser($role = 'member')
    {
        if ($role === 'admin') {
            return \App\Models\User::where('email', 'testadmin@example.com')->first();
        }
        
        return \App\Models\User::where('email', 'testuser@example.com')->first();
    }
}
