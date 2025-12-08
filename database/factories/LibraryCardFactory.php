<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class LibraryCardFactory extends Factory
{
    public function definition(): array
    {
        $student = Student::factory();

        return [
            'student_id' => $student,
            'card_number' => 'LIB-' . fake()->unique()->numberBetween(100000, 999999),
            'barcode' => 'BAR-' . fake()->unique()->numberBetween(10000000, 99999999),
            'qr_code' => null,
            'status' => 'active',
            'issued_date' => now()->toDateString(),
            'expiry_date' => now()->addYears(4)->toDateString(),
            'lost_date' => null,
            'issued_by' => 'Admin',
        ];
    }

    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'lost',
            'lost_date' => now()->toDateString(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
