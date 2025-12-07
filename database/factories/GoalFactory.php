<?php

namespace Database\Factories;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class GoalFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Goal::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $targetAmount = $this->faker->numberBetween(5000, 50000);
        $currentAmount = $this->faker->numberBetween(0, $targetAmount);
        
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence,
            'target_amount' => $targetAmount,
            'current_amount' => $currentAmount,
            'target_date' => Carbon::now()->addMonths($this->faker->numberBetween(1, 12)),
            'status' => $this->faker->randomElement(['in_progress', 'completed', 'cancelled']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
        ];
    }
}