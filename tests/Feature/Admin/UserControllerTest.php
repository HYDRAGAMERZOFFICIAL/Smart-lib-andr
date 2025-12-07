<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $regularUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create an admin user
        $this->admin = User::factory()->create([
            'role' => 'admin'
        ]);
        
        // Create a regular user
        $this->regularUser = User::factory()->create([
            'role' => 'member'
        ]);
    }

    public function test_index_displays_users_list()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Users')
            ->has('users')
        );
    }

    public function test_regular_users_cannot_access_admin_area()
    {
        $response = $this->actingAs($this->regularUser)
            ->get(route('admin.users'));

        $response->assertStatus(403);
    }

    public function test_store_creates_new_user()
    {
        $userData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'mobile' => '1234567890',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'member'
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.store'), $userData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'User created successfully.');
        
        $this->assertDatabaseHas('users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'mobile' => '1234567890',
            'role' => 'member'
        ]);
    }

    public function test_update_modifies_user()
    {
        $updatedData = [
            'id' => $this->regularUser->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'mobile' => '9876543210',
            'role' => 'member'
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.update'), $updatedData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'User updated successfully.');
        
        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'mobile' => '9876543210'
        ]);
    }

    public function test_update_with_password_changes_password()
    {
        $updatedData = [
            'id' => $this->regularUser->id,
            'name' => $this->regularUser->name,
            'email' => $this->regularUser->email,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
            'role' => 'member'
        ];

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.update'), $updatedData);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'User updated successfully.');
        
        // Refresh the user from the database
        $this->regularUser->refresh();
        
        // Check that the password was changed
        $this->assertTrue(Hash::check('NewPassword123!', $this->regularUser->password));
    }

    public function test_destroy_deletes_user()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy'), [
                'id' => $this->regularUser->id
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'User deleted successfully.');
        
        $this->assertDatabaseMissing('users', [
            'id' => $this->regularUser->id
        ]);
    }

    public function test_cannot_delete_own_account()
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy'), [
                'id' => $this->admin->id
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'You cannot delete your own account.');
        
        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id
        ]);
    }

    public function test_update_role_changes_user_role()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.update-role'), [
                'userId' => $this->regularUser->id,
                'role' => 'admin'
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'User role updated successfully.');
        
        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'role' => 'admin'
        ]);
    }

    public function test_impersonate_logs_in_as_another_user()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.impersonate'), [
                'userId' => $this->regularUser->id
            ]);

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('success');
        
        // Check that we're now logged in as the regular user
        $this->assertEquals($this->regularUser->id, auth()->id());
        
        // Check that the impersonator ID is stored in the session
        $this->assertEquals($this->admin->id, session('impersonator_id'));
    }

    public function test_cannot_impersonate_self()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.impersonate'), [
                'userId' => $this->admin->id
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'You cannot impersonate yourself.');
        
        // Check that we're still logged in as the admin
        $this->assertEquals($this->admin->id, auth()->id());
    }

    public function test_stop_impersonating_returns_to_admin_account()
    {
        // Set up the session as if we're impersonating
        session(['impersonator_id' => $this->admin->id]);
        
        // Login as the regular user
        $this->actingAs($this->regularUser);

        $response = $this->post(route('stop.impersonating'));

        $response->assertRedirect(route('admin.dashboard'));
        $response->assertSessionHas('success', 'Returned to admin account');
        
        // Check that we're now logged in as the admin again
        $this->assertEquals($this->admin->id, auth()->id());
        
        // Check that the impersonator ID is removed from the session
        $this->assertFalse(session()->has('impersonator_id'));
    }
}