<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'isbn',
        'title',
        'author',
        'publisher',
        'edition',
        'category',
        'description',
        'cover_image',
        'total_copies',
        'available_copies',
        'language',
        'publication_year',
        'barcode',
    ];

    protected function casts(): array
    {
        return [
            'publication_year' => 'integer',
            'total_copies' => 'integer',
            'available_copies' => 'integer',
        ];
    }

    public function issuedBooks(): HasMany
    {
        return $this->hasMany(IssuedBook::class);
    }
}
