<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'author',
        'edition',
        'publisher',
        'isbn',
        'category',
        'rack',
        'shelf',
        'course',
        'semester',
        'cover_image',
        'description',
        'total_copies',
        'available_copies',
        'is_archived'
    ];

    protected $casts = [
        'is_archived' => 'boolean',
    ];

    public function copies()
    {
        return $this->hasMany(BookCopy::class);
    }

    public function availableCopies()
    {
        return $this->copies()->where('status', 'available');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function updateAvailableCopiesCount()
    {
        $this->available_copies = $this->availableCopies()->count();
        $this->total_copies = $this->copies()->count();
        $this->save();
    }
}
