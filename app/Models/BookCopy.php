<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookCopy extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'book_id',
        'copy_code',
        'barcode',
        'status',
        'condition_notes',
        'acquisition_date',
        'last_maintenance_date',
        'maintenance_notes'
    ];

    protected $casts = [
        'acquisition_date' => 'date',
        'last_maintenance_date' => 'date',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function currentLoan()
    {
        return $this->hasOne(Loan::class)->where('status', 'active');
    }
}
