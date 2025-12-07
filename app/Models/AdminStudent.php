<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdminStudent extends Model
{
    protected $connection = 'admin';
    protected $table = 'students';
    protected $fillable = [
        'student_id',
        'name',
        'email',
        'phone',
        'department',
        'semester',
        'profile_image',
        'status',
        'notes',
    ];

    public $timestamps = true;
}
