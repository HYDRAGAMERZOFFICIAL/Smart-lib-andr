<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AcademicCalendarEventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->randomElement([
                'Semester Start',
                'Mid Term Exams',
                'End Term Exams',
                'Summer Vacation',
                'Registration Period',
                'Library Closure',
                'Convocation',
                'Workshop'
            ]),
            'description' => fake()->paragraph(),
            'start_date' => fake()->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
            'end_date' => fake()->dateTimeBetween('+6 months', '+12 months')->format('Y-m-d'),
            'type' => fake()->randomElement(['holiday', 'exam', 'library_closed', 'event']),
            'is_published' => true,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }
}
