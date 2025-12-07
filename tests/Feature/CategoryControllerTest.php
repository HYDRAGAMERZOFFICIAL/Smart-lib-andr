<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user
        $this->user = User::factory()->create();
    }

    public function test_index_displays_categories()
    {
        // Create some categories
        Category::factory()->count(3)->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('categories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Categories/Index')
            ->has('categories', 3)
        );
    }

    public function test_index_filters_categories_by_type()
    {
        // Create income and expense categories
        Category::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'type' => 'income'
        ]);

        Category::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'type' => 'expense'
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('categories.index', ['type' => 'expense']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Categories/Index')
            ->has('categories', 3)
        );
    }

    public function test_store_creates_new_category()
    {
        $categoryData = [
            'name' => 'Test Category',
            'type' => 'expense',
            'color' => '#FF5733',
            'description' => 'Test description'
        ];

        $response = $this->actingAs($this->user)
            ->post(route('categories.store'), $categoryData);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'user_id' => $this->user->id,
            'name' => 'Test Category',
            'type' => 'expense',
            'color' => '#FF5733',
            'description' => 'Test description'
        ]);
    }

    public function test_update_modifies_category()
    {
        // Create a category
        $category = Category::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Original Name',
            'type' => 'expense',
            'color' => '#000000',
            'description' => 'Original description'
        ]);

        $updatedData = [
            'name' => 'Updated Name',
            'type' => 'expense',
            'color' => '#FFFFFF',
            'description' => 'Updated description'
        ];

        $response = $this->actingAs($this->user)
            ->put(route('categories.update', $category), $updatedData);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Name',
            'color' => '#FFFFFF',
            'description' => 'Updated description'
        ]);
    }

    public function test_destroy_deletes_category_without_transactions()
    {
        // Create a category
        $category = Category::factory()->create([
            'user_id' => $this->user->id
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('categories.destroy', $category));

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseMissing('categories', [
            'id' => $category->id
        ]);
    }

    public function test_cannot_delete_category_with_transactions()
    {
        // Create a category
        $category = Category::factory()->create([
            'user_id' => $this->user->id
        ]);

        // Create a transaction for this category
        Transaction::factory()->create([
            'user_id' => $this->user->id,
            'category_id' => $category->id
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('categories.destroy', $category));

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id
        ]);
    }

    public function test_show_displays_category_with_stats()
    {
        // Create a category
        $category = Category::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Test Category'
        ]);

        // Create some transactions for this category
        Transaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'category_id' => $category->id,
            'amount' => 100
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('categories.show', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Categories/Show')
            ->has('category')
            ->has('stats')
        );
    }

    public function test_user_cannot_access_other_users_categories()
    {
        // Create another user
        $anotherUser = User::factory()->create();
        
        // Create a category for the other user
        $category = Category::factory()->create([
            'user_id' => $anotherUser->id,
            'name' => 'Other User Category'
        ]);

        // Try to view the category
        $response = $this->actingAs($this->user)
            ->get(route('categories.show', $category));

        $response->assertStatus(404);

        // Try to update the category
        $response = $this->actingAs($this->user)
            ->put(route('categories.update', $category), [
                'name' => 'Updated Name',
                'type' => 'expense'
            ]);

        $response->assertStatus(404);

        // Try to delete the category
        $response = $this->actingAs($this->user)
            ->delete(route('categories.destroy', $category));

        $response->assertStatus(404);
    }
}