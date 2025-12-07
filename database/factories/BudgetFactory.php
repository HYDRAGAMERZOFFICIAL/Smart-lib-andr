<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class BudgetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Budget::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory()->state(['type' => 'expense']),
            'amount' => $this->faker->numberBetween(1000, 10000),
            'period' => $this->faker->randomElement(['daily', 'weekly', 'monthly', 'yearly']),
            'start_date' => Carbon::now()->startOfMonth(),
            'end_date' => Carbon::now()->endOfMonth(),
        ];
    }
}