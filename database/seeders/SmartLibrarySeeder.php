<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\Loan;
use App\Models\Fine;
use App\Models\LibraryCard;
use App\Models\AcademicCalendarEvent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SmartLibrarySeeder extends Seeder
{
    public function run(): void
    {
        echo "\n=== Smart Library System Seeding Started ===\n";

        echo "\nCreating Admin User...\n";
        $admin = User::firstOrCreate(
            ['email' => 'admin@smartlibrary.com'],
            [
                'name' => 'Library Administrator',
                'email_verified_at' => now(),
                'password' => Hash::make('Admin@123'),
                'is_approved' => true,
            ]
        );
        echo "✓ Admin created: {$admin->email}\n";

        echo "\nCreating Students and Users...\n";
        $students = [];
        for ($i = 1; $i <= 15; $i++) {
            $student = Student::factory()->create();
            $user = User::firstOrCreate(
                ['email' => $student->email],
                [
                    'name' => $student->name,
                    'email_verified_at' => now(),
                    'password' => Hash::make('Student@123'),
                    'is_approved' => true,
                ]
            );
            $students[] = $student;
            echo "✓ Student created: {$student->name} ({$student->id_number})\n";
        }

        echo "\nCreating Library Cards...\n";
        foreach ($students as $student) {
            LibraryCard::factory()->create(['student_id' => $student->id]);
        }
        echo "✓ Library cards generated for all students\n";

        echo "\nCreating Books...\n";
        $books = Book::factory(25)->create();
        foreach ($books as $book) {
            echo "✓ Book: {$book->title}\n";
        }

        echo "\nCreating Book Copies...\n";
        $bookCopies = [];
        foreach ($books as $book) {
            $copiesCount = $book->total_copies;
            for ($i = 0; $i < $copiesCount; $i++) {
                $copy = BookCopy::factory()
                    ->for($book)
                    ->create();
                $bookCopies[] = $copy;
            }
        }
        echo "✓ {" . count($bookCopies) . "} book copies created\n";

        echo "\nCreating Active Loans...\n";
        $activeLoansCount = 0;
        foreach ($students as $index => $student) {
            if ($index < 10) {
                $loansCount = rand(1, 3);
                for ($i = 0; $i < $loansCount; $i++) {
                    $randomCopy = $bookCopies[array_rand($bookCopies)];
                    Loan::factory()->create([
                        'student_id' => $student->id,
                        'book_copy_id' => $randomCopy->id,
                        'book_id' => $randomCopy->book_id,
                        'issued_date' => now()->subDays(rand(1, 10)),
                        'due_date' => now()->addDays(rand(1, 14)),
                    ]);
                    $activeLoansCount++;
                }
            }
        }
        echo "✓ {$activeLoansCount} active loans created\n";

        echo "\nCreating Returned Loans (History)...\n";
        $returnedLoansCount = 0;
        foreach ($students as $index => $student) {
            if ($index < 8) {
                $loansCount = rand(2, 4);
                for ($i = 0; $i < $loansCount; $i++) {
                    $randomCopy = $bookCopies[array_rand($bookCopies)];
                    Loan::factory()->returned()->create([
                        'student_id' => $student->id,
                        'book_copy_id' => $randomCopy->id,
                        'book_id' => $randomCopy->book_id,
                        'issued_date' => now()->subDays(rand(30, 90)),
                        'due_date' => now()->subDays(rand(5, 20)),
                        'returned_date' => now()->subDays(rand(0, 5)),
                    ]);
                    $returnedLoansCount++;
                }
            }
        }
        echo "✓ {$returnedLoansCount} returned loans created\n";

        echo "\nCreating Overdue Loans...\n";
        $overdueLoansCount = 0;
        foreach ($students as $index => $student) {
            if ($index < 5) {
                $randomCopy = $bookCopies[array_rand($bookCopies)];
                $loan = Loan::factory()->overdue()->create([
                    'student_id' => $student->id,
                    'book_copy_id' => $randomCopy->id,
                    'book_id' => $randomCopy->book_id,
                ]);
                $overdueLoansCount++;

                Fine::factory()->create([
                    'student_id' => $student->id,
                    'loan_id' => $loan->id,
                    'type' => 'overdue',
                    'description' => "Overdue fine for: {$loan->book->title}",
                    'amount' => $loan->calculateFine(),
                    'status' => fake()->randomElement(['pending', 'pending', 'pending', 'paid']),
                ]);
            }
        }
        echo "✓ {$overdueLoansCount} overdue loans created with fines\n";

        echo "\nCreating Additional Fines...\n";
        $finesCount = 0;
        foreach ($students as $index => $student) {
            if ($index < 12 && rand(0, 1)) {
                Fine::factory()->create([
                    'student_id' => $student->id,
                    'type' => fake()->randomElement(['damage', 'lost_book']),
                    'status' => fake()->randomElement(['pending', 'paid', 'waived']),
                ]);
                $finesCount++;
            }
        }
        echo "✓ {$finesCount} additional fines created\n";

        echo "\nCreating Academic Calendar Events...\n";
        $calendarEvents = [
            [
                'title' => 'Semester 1 Start',
                'description' => 'Beginning of the academic year',
                'start_date' => now()->startOfYear()->format('Y-m-d'),
                'end_date' => now()->startOfYear()->addMonths(6)->format('Y-m-d'),
                'type' => 'event',
            ],
            [
                'title' => 'Mid Term Exams',
                'description' => 'Mid-semester examinations',
                'start_date' => now()->startOfYear()->addMonths(2)->format('Y-m-d'),
                'end_date' => now()->startOfYear()->addMonths(2)->addDays(20)->format('Y-m-d'),
                'type' => 'exam',
            ],
            [
                'title' => 'End Term Exams',
                'description' => 'Final semester examinations',
                'start_date' => now()->startOfYear()->addMonths(5)->format('Y-m-d'),
                'end_date' => now()->startOfYear()->addMonths(6)->format('Y-m-d'),
                'type' => 'exam',
            ],
            [
                'title' => 'Summer Vacation',
                'description' => 'Summer break period',
                'start_date' => now()->startOfYear()->addMonths(6)->format('Y-m-d'),
                'end_date' => now()->startOfYear()->addMonths(7)->format('Y-m-d'),
                'type' => 'holiday',
            ],
            [
                'title' => 'Library Maintenance',
                'description' => 'Library closed for maintenance',
                'start_date' => now()->addMonths(3)->format('Y-m-d'),
                'end_date' => now()->addMonths(3)->addDays(5)->format('Y-m-d'),
                'type' => 'library_closed',
            ],
            [
                'title' => 'Workshop: Research Methods',
                'description' => 'Training workshop on research methodologies',
                'start_date' => now()->addWeeks(2)->format('Y-m-d'),
                'end_date' => now()->addWeeks(2)->addDays(2)->format('Y-m-d'),
                'type' => 'event',
            ],
        ];

        foreach ($calendarEvents as $event) {
            AcademicCalendarEvent::firstOrCreate(
                ['title' => $event['title']],
                $event
            );
            echo "✓ Event created: {$event['title']}\n";
        }

        echo "\n=== Smart Library System Seeding Completed ===\n";
        echo "\n📊 Summary:\n";
        echo "   • Admin Users: 1\n";
        echo "   • Students: " . count($students) . "\n";
        echo "   • Books: " . count($books) . "\n";
        echo "   • Book Copies: " . count($bookCopies) . "\n";
        echo "   • Active Loans: {$activeLoansCount}\n";
        echo "   • Returned Loans: {$returnedLoansCount}\n";
        echo "   • Overdue Loans: {$overdueLoansCount}\n";
        echo "   • Total Fines: " . ($finesCount + $overdueLoansCount) . "\n";
        echo "   • Academic Events: " . count($calendarEvents) . "\n";
        echo "\n💡 Login Credentials:\n";
        echo "   Admin Email: admin@smartlibrary.com\n";
        echo "   Admin Password: Admin@123\n";
        echo "   Student Password: Student@123 (for all students)\n\n";
    }
}
