<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $type = $this->faker->randomElement(['income', 'expense']);
        
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory()->state(['type' => $type]),
            'amount' => $this->faker->numberBetween(100, 5000),
            'type' => $type,
            'date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'description' => $this->faker->sentence,
        ];
    }
}