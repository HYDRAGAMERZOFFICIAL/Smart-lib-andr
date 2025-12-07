<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminBook extends Model
{
    protected $connection = 'admin';
    protected $table = 'books';
    protected $fillable = [
        'book_id',
        'title',
        'author',
        'isbn',
        'publisher',
        'edition',
        'category',
        'description',
        'total_copies',
        'available_copies',
        'language',
        'publication_year',
        'barcode',
    ];

    public $timestamps = true;
}
