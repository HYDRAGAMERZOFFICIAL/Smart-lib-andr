<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        $barcode = 'BAR-' . str_pad($student->id, 8, '0', STR_PAD_LEFT) . str_pad(rand(100, 999), 3);

        return self::create([
            'student_id' => $studentId,
            'card_number' => $cardNumber,
            'barcode' => $barcode,
            'status' => 'active',
            'issued_date' => now()->toDateString(),
            'expiry_date' => now()->addYears(4)->toDateString(),
            'issued_by' => $issuedBy
        ]);
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
}
