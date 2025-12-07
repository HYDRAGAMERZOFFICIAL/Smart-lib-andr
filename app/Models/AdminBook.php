<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminBook extends Model
{
    use HasFactory;

    protected $connection = 'mysql_admin';
    protected $table = 'books';

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
        'rack',
        'shelf',
        'course',
        'semester',
        'barcode',
        'is_archived',
    ];

    protected $casts = [
        'total_copies' => 'integer',
        'available_copies' => 'integer',
        'is_archived' => 'boolean',
        'publication_year' => 'integer',
    ];

    public function scopeAvailable($query)
    {
        return $query->where('available_copies', '>', 0)->where('is_archived', false);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByCourse($query, $course, $semester = null)
    {
        $query->where('course', $course);
        if ($semester) {
            $query->where('semester', $semester);
        }
        return $query;
    }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('title', 'like', "%{$searchTerm}%")
            ->orWhere('author', 'like', "%{$searchTerm}%")
            ->orWhere('isbn', 'like', "%{$searchTerm}%");
    }
}
