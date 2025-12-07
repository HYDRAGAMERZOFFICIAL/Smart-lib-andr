<?php

namespace App\Http\Controllers;

use App\Models\LibraryCard;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryCardController extends Controller
{
    public function index()
    {
        $cards = LibraryCard::with('student')
            ->get()
            ->map(function ($card) {
                return [
                    'id' => $card->id,
                    'card_number' => $card->card_number,
                    'student_name' => $card->student->name,
                    'student_id_number' => $card->student->id_number,
                    'status' => $card->status,
                    'issued_date' => $card->issued_date,
                    'barcode' => $card->barcode,
                    'created_at' => $card->created_at
                ];
            });

        $students = Student::where('status', 'approved')
            ->get()
            ->map(function ($s) {
                return ['id' => $s->id, 'name' => $s->name, 'id_number' => $s->id_number];
            });

        return Inertia::render('LibraryCards/Index', [
            'cards' => $cards,
            'students' => $students
        ]);
    }

    public function generate(Student $student)
    {
        if ($student->status !== 'approved') {
            return back()->with('error', 'Only approved students can have library cards');
        }

        $existingCard = LibraryCard::where('student_id', $student->id)
            ->where('status', 'active')
            ->first();

        if ($existingCard) {
            return back()->with('error', 'Student already has an active library card');
        }

        LibraryCard::generateForStudent($student->id, auth()->user()->name);

        return back()->with('success', 'Library card generated successfully');
    }

    public function reissue(LibraryCard $card)
    {
        $newCard = $card->reissue(auth()->user()->name);

        return back()->with('success', 'Library card reissued successfully');
    }

    public function print(LibraryCard $card)
    {
        return Inertia::render('LibraryCards/Print', [
            'card' => [
                'card_number' => $card->card_number,
                'student_name' => $card->student->name,
                'student_id' => $card->student->id_number,
                'barcode' => $card->barcode,
                'qr_code' => $card->qr_code,
                'issued_date' => $card->issued_date,
                'expiry_date' => $card->expiry_date,
                'photo' => $card->student->photo
            ]
        ]);
    }
}
