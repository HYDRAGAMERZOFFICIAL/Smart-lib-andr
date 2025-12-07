<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Goal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class GoalControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user
        $this->user = User::factory()->create();
    }

    public function test_index_displays_goals()
    {
        // Create some goals
        Goal::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'status' => 'in_progress'
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('goals.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Goals/Index')
            ->has('goals', 3)
        );
    }

    public function test_store_creates_new_goal()
    {
        $goalData = [
            'name' => 'Test Goal',
            'description' => 'Test description',
            'target_amount' => 5000,
            'current_amount' => 1000,
            'target_date' => Carbon::now()->addMonths(6)->format('Y-m-d'),
            'priority' => 'high'
        ];

        $response = $this->actingAs($this->user)
            ->post(route('goals.store'), $goalData);

        $response->assertRedirect(route('goals.index'));
        $this->assertDatabaseHas('goals', [
            'user_id' => $this->user->id,
            'name' => 'Test Goal',
            'target_amount' => 5000,
            'current_amount' => 1000,
            'priority' => 'high'
        ]);
    }

    public function test_update_modifies_goal()
    {
        // Create a goal
        $goal = Goal::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Original Name',
            'target_amount' => 5000,
            'current_amount' => 1000,
            'status' => 'in_progress'
        ]);

        $updatedData = [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'target_amount' => 6000,
            'current_amount' => 2000,
            'target_date' => Carbon::now()->addMonths(6)->format('Y-m-d'),
            'priority' => 'medium',
            'status' => 'in_progress'
        ];

        $response = $this->actingAs($this->user)
            ->put(route('goals.update', $goal), $updatedData);

        $response->assertRedirect(route('goals.index'));
        $this->assertDatabaseHas('goals', [
            'id' => $goal->id,
            'name' => 'Updated Name',
            'target_amount' => 6000,
            'current_amount' => 2000,
            'priority' => 'medium'
        ]);
    }

    public function test_destroy_deletes_goal()
    {
        // Create a goal
        $goal = Goal::factory()->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('goals.destroy', $goal));

        $response->assertRedirect(route('goals.index'));
        $this->assertDatabaseMissing('goals', [
            'id' => $goal->id
        ]);
    }

    public function test_update_amount_adds_to_goal()
    {
        // Create a goal
        $goal = Goal::factory()->create([
            'user_id' => $this->user->id,
            'current_amount' => 1000,
            'target_amount' => 5000,
            'status' => 'in_progress'
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('goals.update-amount', $goal), [
                'amount' => 500,
                'operation' => 'add'
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('goals', [
            'id' => $goal->id,
            'current_amount' => 1500
        ]);
    }

    public function test_update_amount_subtracts_from_goal()
    {
        // Create a goal
        $goal = Goal::factory()->create([
            'user_id' => $this->user->id,
            'current_amount' => 1000,
            'target_amount' => 5000,
            'status' => 'in_progress'
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('goals.update-amount', $goal), [
                'amount' => 300,
                'operation' => 'subtract'
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('goals', [
            'id' => $goal->id,
            'current_amount' => 700
        ]);
    }

    public function test_update_amount_sets_goal_amount()
    {
        // Create a goal
        $goal = Goal::factory()->create([
            'user_id' => $this->user->id,
            'current_amount' => 1000,
            'target_amount' => 5000,
            'status' => 'in_progress'
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('goals.update-amount', $goal), [
                'amount' => 2000,
                'operation' => 'set'
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('goals', [
            'id' => $goal->id,
            'current_amount' => 2000
        ]);
    }

    public function test_goal_is_marked_completed_when_target_reached()
    {
        // Create a goal
        $goal = Goal::factory()->create([
            'user_id' => $this->user->id,
            'current_amount' => 4000,
            'target_amount' => 5000,
            'status' => 'in_progress'
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('goals.update-amount', $goal), [
                'amount' => 1000,
                'operation' => 'add'
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('goals', [
            'id' => $goal->id,
            'current_amount' => 5000,
            'status' => 'completed'
        ]);
    }

    public function test_summary_displays_goal_statistics()
    {
        // Create in-progress goals
        Goal::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'status' => 'in_progress',
            'target_amount' => 5000,
            'current_amount' => 1000
        ]);

        // Create completed goals
        Goal::factory()->count(1)->create([
            'user_id' => $this->user->id,
            'status' => 'completed',
            'target_amount' => 3000,
            'current_amount' => 3000
        ]);

        // Create cancelled goals
        Goal::factory()->count(1)->create([
            'user_id' => $this->user->id,
            'status' => 'cancelled',
            'target_amount' => 2000,
            'current_amount' => 500
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('goals.summary'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Goals/Summary')
            ->has('statistics')
            ->has('upcomingGoals')
        );
    }

    public function test_user_cannot_access_other_users_goals()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create a goal for the other user
        $goal = Goal::factory()->create([
            'user_id' => $anotherUser->id,
            'name' => 'Other User Goal'
        ]);

        // Try to view the goal
        $response = $this->actingAs($this->user)
            ->get(route('goals.show', $goal));

        $response->assertStatus(404);

        // Try to update the goal
        $response = $this->actingAs($this->user)
            ->put(route('goals.update', $goal), [
                'name' => 'Updated Name',
                'target_amount' => 6000,
                'current_amount' => 2000,
                'target_date' => Carbon::now()->addMonths(6)->format('Y-m-d'),
                'priority' => 'medium',
                'status' => 'in_progress'
            ]);

        $response->assertStatus(404);

        // Try to delete the goal
        $response = $this->actingAs($this->user)
            ->delete(route('goals.destroy', $goal));

        $response->assertStatus(404);
    }
}