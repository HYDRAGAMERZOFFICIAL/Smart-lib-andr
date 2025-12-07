<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Create test student accounts
        $students = [
            [
                'id_number' => 'STU001',
                'name' => 'John Doe',
                'email' => 'john@student.edu',
                'phone' => '9876543210',
                'department' => 'Computer Science',
                'semester' => '4',
                'password' => Hash::make('Student@123'),
                'is_approved' => true,
            ],
            [
                'id_number' => 'STU002',
                'name' => 'Jane Smith',
                'email' => 'jane@student.edu',
                'phone' => '9876543211',
                'department' => 'Electronics',
                'semester' => '2',
                'password' => Hash::make('Student@123'),
                'is_approved' => true,
            ],
            [
                'id_number' => 'STU003',
                'name' => 'Mike Johnson',
                'email' => 'mike@student.edu',
                'phone' => '9876543212',
                'department' => 'Mechanical Engineering',
                'semester' => '6',
                'password' => Hash::make('Student@123'),
                'is_approved' => true,
            ],
        ];

        foreach ($students as $student) {
            User::create($student);
        }

        // Create sample books
        $books = [
            [
                'isbn' => '978-0-13-468599-1',
                'title' => 'Clean Code',
                'author' => 'Robert C. Martin',
                'publisher' => 'Prentice Hall',
                'edition' => '1st',
                'category' => 'Technology',
                'description' => 'A Handbook of Agile Software Craftsmanship',
                'total_copies' => 5,
                'available_copies' => 3,
                'language' => 'English',
                'publication_year' => 2008,
                'barcode' => 'BOOK001',
            ],
            [
                'isbn' => '978-0-201-61622-4',
                'title' => 'The Pragmatic Programmer',
                'author' => 'Andrew Hunt, David Thomas',
                'publisher' => 'Addison-Wesley',
                'edition' => '1st',
                'category' => 'Technology',
                'description' => 'Your Journey to Mastery',
                'total_copies' => 4,
                'available_copies' => 2,
                'language' => 'English',
                'publication_year' => 1999,
                'barcode' => 'BOOK002',
            ],
            [
                'isbn' => '978-0-596-00712-6',
                'title' => 'Learning PHP, MySQL & JavaScript',
                'author' => 'Robin Nixon',
                'publisher' => 'O\'Reilly Media',
                'edition' => '4th',
                'category' => 'Technology',
                'description' => 'With jQuery, CSS, & HTML5',
                'total_copies' => 6,
                'available_copies' => 4,
                'language' => 'English',
                'publication_year' => 2014,
                'barcode' => 'BOOK003',
            ],
            [
                'isbn' => '978-1-491-95023-8',
                'title' => 'Building Microservices',
                'author' => 'Sam Newman',
                'publisher' => 'O\'Reilly Media',
                'edition' => '1st',
                'category' => 'Technology',
                'description' => 'Designing Fine-Grained Systems',
                'total_copies' => 3,
                'available_copies' => 1,
                'language' => 'English',
                'publication_year' => 2015,
                'barcode' => 'BOOK004',
            ],
            [
                'isbn' => '978-0-13-110362-7',
                'title' => 'The C Programming Language',
                'author' => 'Brian W. Kernighan, Dennis M. Ritchie',
                'publisher' => 'Prentice Hall',
                'edition' => '2nd',
                'category' => 'Technology',
                'description' => 'A reference manual',
                'total_copies' => 5,
                'available_copies' => 5,
                'language' => 'English',
                'publication_year' => 1988,
                'barcode' => 'BOOK005',
            ],
            [
                'isbn' => '978-0-134-49415-4',
                'title' => 'Effective Java',
                'author' => 'Joshua Bloch',
                'publisher' => 'Addison-Wesley',
                'edition' => '3rd',
                'category' => 'Technology',
                'description' => 'Programming Language Guide',
                'total_copies' => 4,
                'available_copies' => 2,
                'language' => 'English',
                'publication_year' => 2018,
                'barcode' => 'BOOK006',
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}
