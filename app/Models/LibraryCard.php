<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Picqer\Barcode\BarcodeGeneratorPNG;

class LibraryCard extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'card_number',
        'barcode',
        'qr_code',
        'status',
        'issued_date',
        'expiry_date',
        'lost_date',
        'issued_by'
    ];

    protected $casts = [
        'issued_date' => 'date',
        'expiry_date' => 'date',
        'lost_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public static function generateForStudent($studentId, $issuedBy = null)
    {
        $student = Student::find($studentId);
        if (!$student) return null;

        $cardNumber = 'LIB-' . str_pad($student->id, 6, '0', STR_PAD_LEFT);
        $barcodeText = 'BAR-' . str_pad($student->id, 8, '0', STR_PAD_LEFT) . str_pad(rand(100, 999), 3);

        $card = self::create([
            'student_id' => $studentId,
            'card_number' => $cardNumber,
            'barcode' => $barcodeText,
            'status' => 'active',
            'issued_date' => now()->toDateString(),
            'expiry_date' => now()->addYears(4)->toDateString(),
            'issued_by' => $issuedBy
        ]);

        self::generateBarcodeImage($card);

        return $card;
    }

    private static function generateBarcodeImage($card)
    {
        $generator = new BarcodeGeneratorPNG();
        $barcodePath = storage_path("app/public/barcodes/{$card->id}.png");
        
        if (!is_dir(storage_path("app/public/barcodes"))) {
            mkdir(storage_path("app/public/barcodes"), 0755, true);
        }

        file_put_contents(
            $barcodePath,
            $generator->getBarcode($card->barcode, BarcodeGeneratorPNG::TYPE_CODE_128)
        );

        return "storage/barcodes/{$card->id}.png";
    }

    public function markAsLost()
    {
        $this->update([
            'status' => 'lost',
            'lost_date' => now()->toDateString()
        ]);

        return $this;
    }

    public function reissue($issuedBy = null)
    {
        $this->update(['status' => 'inactive']);

        return self::generateForStudent($this->student_id, $issuedBy);
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
