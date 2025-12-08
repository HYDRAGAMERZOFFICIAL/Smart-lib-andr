<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookCopyFactory extends Factory
{
    public function definition(): array
    {
        static $copyCounter = 0;
        $copyCounter++;

        return [
            'book_id' => Book::factory(),
            'copy_code' => 'COPY-' . str_pad($copyCounter, 8, '0', STR_PAD_LEFT),
            'barcode' => fake()->unique()->isbn10(),
            'status' => 'available',
            'condition_notes' => fake()->sentence(),
            'acquisition_date' => fake()->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
            'last_maintenance_date' => null,
            'maintenance_notes' => null,
        ];
    }

    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    public function issued(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'issued',
        ]);
    }

    public function damaged(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'damaged',
            'condition_notes' => 'Book is damaged',
        ]);
    }

    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'lost',
            'condition_notes' => 'Book is lost',
        ]);
    }
}
