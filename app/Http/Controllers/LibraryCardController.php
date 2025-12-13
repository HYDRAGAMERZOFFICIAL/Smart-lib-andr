<?php

namespace App\Http\Controllers;

use App\Models\LibraryCard;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryCardController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return Inertia::render('LibraryCard/NotGenerated');
        }

        $card = LibraryCard::where('student_id', $student->id)
            ->where('status', 'active')
            ->first();

        if (!$card) {
            return Inertia::render('LibraryCard/NotGenerated');
        }

        $this->ensureBarcodeImageExists($card);

        return Inertia::render('LibraryCard/Show', [
            'card' => [
                'card_number' => $card->card_number,
                'student_name' => $card->student->name,
                'student_id' => $card->student->id_number,
                'barcode' => asset("storage/barcodes/{$card->id}.png"),
                'qr_code' => $card->qr_code,
                'issued_date' => $card->issued_date,
                'expiry_date' => $card->expiry_date,
                'photo' => $card->student->photo
            ]
        ]);
    }

    private function ensureBarcodeImageExists($card)
    {
        $barcodePath = storage_path("app/public/barcodes/{$card->id}.png");

        if (!file_exists($barcodePath)) {
            $this->generateBarcodeImage($card);
        }
    }

    private function generateBarcodeImage($card)
    {
        $generator = new \Picqer\Barcode\BarcodeGeneratorPNG();
        $barcodePath = storage_path("app/public/barcodes/{$card->id}.png");
        
        if (!is_dir(storage_path("app/public/barcodes"))) {
            mkdir(storage_path("app/public/barcodes"), 0755, true);
        }

        file_put_contents(
            $barcodePath,
            $generator->getBarcode($card->barcode, \Picqer\Barcode\BarcodeGeneratorPNG::TYPE_CODE_128)
        );
    }

    public function download()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return back()->with('error', 'Student profile not found');
        }

        $card = LibraryCard::where('student_id', $student->id)
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

    public function request()
    {
        $user = auth()->user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return back()->with('error', 'Student profile not found');
        }

        $existingRequest = LibraryCard::where('student_id', $student->id)
            ->where('status', 'pending_replacement')
            ->exists();

        if ($existingRequest) {
            return back()->with('warning', 'You already have a pending library card request');
        }

        LibraryCard::create([
            'student_id' => $student->id,
            'status' => 'pending_replacement',
            'card_number' => 'PENDING-' . time(),
        ]);

        return back()->with('success', 'Library card replacement request submitted successfully. You will be notified once it is ready.');
    }
}
