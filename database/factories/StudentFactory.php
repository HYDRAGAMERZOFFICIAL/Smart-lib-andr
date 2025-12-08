<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $email = fake()->unique()->safeEmail();

        return [
            'id_number' => 'STU' . fake()->unique()->numberBetween(100000, 999999),
            'name' => "{$firstName} {$lastName}",
            'email' => $email,
            'phone' => fake()->phoneNumber(),
            'department' => fake()->randomElement(['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical']),
            'course' => fake()->randomElement(['B.Tech', 'B.Sc', 'M.Tech', 'M.Sc']),
            'semester' => fake()->randomElement(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']),
            'status' => 'approved',
            'address' => fake()->address(),
            'photo' => null,
            'date_of_birth' => fake()->dateTimeBetween('-25 years', '-18 years')->format('Y-m-d'),
            'guardian_name' => fake()->name(),
            'guardian_phone' => fake()->phoneNumber(),
            'approved_at' => now(),
            'rejected_at' => null,
            'blocked_at' => null,
            'rejection_reason' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'approved_at' => null,
        ]);
    }

    public function blocked(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'blocked',
            'blocked_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => 'Application does not meet criteria',
        ]);
    }
}
