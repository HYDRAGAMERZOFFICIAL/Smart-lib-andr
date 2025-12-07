<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminAcademicCalendarEvent extends Model
{
    use HasFactory;

    protected $connection = 'mysql_admin';
    protected $table = 'academic_calendar_events';

    protected $fillable = [
        'title',
        'description',
        'type',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'location',
        'is_published',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_published' => 'boolean',
    ];

    protected $dates = [
        'start_date',
        'end_date',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>=', now()->toDateString())
            ->where('is_published', true)
            ->orderBy('start_date');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
