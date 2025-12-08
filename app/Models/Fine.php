<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Fine extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'loan_id',
        'type',
        'description',
        'amount',
        'due_date',
        'status',
        'paid_date',
        'payment_method',
        'payment_notes',
        'waived_by',
        'waive_reason',
        'waived_at'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'paid_date' => 'datetime',
        'waived_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function markAsPaid($paymentMethod = null, $notes = null)
    {
        $this->update([
            'status' => 'paid',
            'paid_date' => now(),
            'payment_method' => $paymentMethod,
            'payment_notes' => $notes
        ]);

        return $this;
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeWaived($query)
    {
        return $query->where('status', 'waived');
    }
}
