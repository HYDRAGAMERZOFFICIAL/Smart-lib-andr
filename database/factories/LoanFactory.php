<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\BookCopy;
use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanFactory extends Factory
{
    public function definition(): array
    {
        $bookCopy = BookCopy::factory();
        $book = Book::factory();

        return [
            'student_id' => Student::factory(),
            'book_copy_id' => $bookCopy,
            'book_id' => $book,
            'issued_date' => now(),
            'due_date' => now()->addDays(14),
            'returned_date' => null,
            'status' => 'active',
            'fine_amount' => 0,
            'fine_paid' => false,
            'fine_paid_date' => null,
            'issued_by' => 'Librarian',
            'returned_by' => null,
            'issued_by_id' => null,
            'returned_by_id' => null,
            'return_notes' => null,
            'damage_notes' => null,
        ];
    }

    public function returned(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'returned',
            'returned_date' => fake()->dateTimeBetween('now', '+7 days'),
            'returned_by' => 'Librarian',
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'overdue',
            'due_date' => now()->subDays(5),
            'fine_amount' => fake()->numberBetween(25, 200),
        ]);
    }

    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'lost',
            'fine_amount' => 500,
        ]);
    }
}
