<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IssuedBook extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'issued_date',
        'due_date',
        'returned_date',
        'status',
        'fine',
    ];

    protected function casts(): array
    {
        return [
            'issued_date' => 'datetime',
            'due_date' => 'datetime',
            'returned_date' => 'datetime',
            'fine' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
