<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'type',
        'title',
        'message',
        'subject',
        'channel',
        'is_sent',
        'sent_at',
        'is_read',
        'read_at',
        'send_error',
        'created_by'
    ];

    protected $casts = [
        'is_sent' => 'boolean',
        'sent_at' => 'datetime',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function markAsSent($error = null)
    {
        $this->update([
            'is_sent' => true,
            'sent_at' => now(),
            'send_error' => $error
        ]);

        return $this;
    }

    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);

        return $this;
    }
}
