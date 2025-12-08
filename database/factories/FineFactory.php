<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Loan;
use Illuminate\Database\Eloquent\Factories\Factory;

class FineFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'loan_id' => Loan::factory(),
            'type' => fake()->randomElement(['overdue', 'damage', 'lost_book']),
            'description' => fake()->sentence(),
            'amount' => fake()->numberBetween(10, 500),
            'due_date' => now(),
            'status' => 'pending',
            'paid_date' => null,
            'payment_method' => null,
            'payment_notes' => null,
            'waived_by' => null,
            'waive_reason' => null,
            'waived_at' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'paid_date' => now(),
            'payment_method' => fake()->randomElement(['cash', 'card', 'transfer']),
        ]);
    }

    public function waived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'waived',
            'waived_by' => 'Librarian',
            'waive_reason' => 'Goodwill waiver',
            'waived_at' => now(),
        ]);
    }
}
