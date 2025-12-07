<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IssueReturnTransaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'book_copy_id',
        'book_id',
        'type',
        'transaction_date',
        'processed_by',
        'notes',
        'is_successful',
        'error_message'
    ];

    protected $casts = [
        'transaction_date' => 'datetime',
        'is_successful' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function bookCopy()
    {
        return $this->belongsTo(BookCopy::class);
    }
}
