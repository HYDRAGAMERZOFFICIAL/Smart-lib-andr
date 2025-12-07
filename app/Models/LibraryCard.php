<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibraryCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'card_number',
        'barcode',
        'qr_code',
        'issue_date',
        'expiry_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'datetime',
            'expiry_date' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
