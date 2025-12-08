<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    public function definition(): array
    {
        return [
            'isbn' => fake()->unique()->isbn13(),
            'title' => fake()->sentence(4),
            'author' => fake()->name(),
            'publisher' => fake()->company(),
            'edition' => fake()->randomElement(['1st', '2nd', '3rd', '4th', '5th']),
            'category' => fake()->randomElement(['Mathematics', 'Physics', 'Chemistry', 'Electronics', 'Programming', 'Literature', 'History', 'Biology']),
            'rack' => fake()->randomElement(['A', 'B', 'C', 'D', 'E']),
            'shelf' => fake()->randomElement(['1', '2', '3', '4', '5']),
            'course' => fake()->randomElement(['B.Tech', 'B.Sc', 'M.Tech', 'M.Sc']),
            'semester' => fake()->randomElement(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']),
            'cover_image' => null,
            'description' => fake()->paragraph(),
            'total_copies' => fake()->numberBetween(3, 10),
            'available_copies' => fake()->numberBetween(1, 10),
            'is_archived' => false,
        ];
    }

    public function unavailable(): static
    {
        return $this->state(fn (array $attributes) => [
            'available_copies' => 0,
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_archived' => true,
        ]);
    }
}
