<?php

namespace App\Http\Controllers;

use App\Models\LibraryCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryCardController extends Controller
{
    public function show()
    {
        $user = auth()->user();

        $card = LibraryCard::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (!$card) {
            return Inertia::render('LibraryCard/NotGenerated');
        }

        return Inertia::render('LibraryCard/Show', [
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

    public function download()
    {
        $user = auth()->user();

        $card = LibraryCard::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (!$card) {
            return back()->with('error', 'No active library card found');
        }

        $format = request()->input('format', 'png');

        if ($format === 'pdf') {
            return $this->downloadPdf($card);
        }

        return $this->downloadPng($card);
    }

    private function downloadPng($card)
    {
        return response()->download(storage_path("library_cards/{$card->id}.png"));
    }

    private function downloadPdf($card)
    {
        return response()->download(storage_path("library_cards/{$card->id}.pdf"));
    }
}
