<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Loan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'book_copy_id',
        'book_id',
        'issued_date',
        'due_date',
        'returned_date',
        'status',
        'fine_amount',
        'fine_paid',
        'fine_paid_date',
        'issued_by',
        'returned_by',
        'issued_by_id',
        'returned_by_id',
        'return_notes',
        'damage_notes'
    ];

    protected $casts = [
        'issued_date' => 'datetime',
        'due_date' => 'datetime',
        'returned_date' => 'datetime',
        'fine_paid' => 'boolean',
        'fine_paid_date' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function bookCopy()
    {
        return $this->belongsTo(BookCopy::class);
    }

    public function fines()
    {
        return $this->hasMany(Fine::class);
    }

    public function issuedByUser()
    {
        return $this->belongsTo(User::class, 'issued_by_id');
    }

    public function returnedByUser()
    {
        return $this->belongsTo(User::class, 'returned_by_id');
    }

    public function isOverdue()
    {
        return $this->status === 'active' && $this->due_date < now();
    }

    public function getDaysOverdue()
    {
        if (!$this->isOverdue()) return 0;
        return $this->due_date->diffInDays(now());
    }

    public function calculateFine($dailyRate = 5)
    {
        if ($this->status !== 'active') return 0;
        
        if (!$this->isOverdue()) return 0;

        return $this->getDaysOverdue() * $dailyRate;
    }

    public function markAsReturned($returnedBy = null, $damageNotes = null, $returnedById = null)
    {
        $fine = $this->calculateFine();

        $this->update([
            'status' => 'returned',
            'returned_date' => now(),
            'returned_by' => $returnedBy,
            'returned_by_id' => $returnedById,
            'damage_notes' => $damageNotes,
            'fine_amount' => $fine
        ]);

        if ($fine > 0) {
            Fine::create([
                'student_id' => $this->student_id,
                'loan_id' => $this->id,
                'type' => 'overdue',
                'description' => "Overdue fine for {$this->book->title}",
                'amount' => $fine,
                'due_date' => now(),
                'status' => 'pending'
            ]);
        }

        $this->bookCopy->update(['status' => 'available']);
        $this->book->updateAvailableCopiesCount();

        return $this;
    }

    public function waiveFine($waivedBy = null, $reason = null)
    {
        Fine::where('loan_id', $this->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'waived',
                'waived_by' => $waivedBy,
                'waive_reason' => $reason,
                'waived_at' => now()
            ]);

        return $this;
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeReturned($query)
    {
        return $query->where('status', 'returned');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'active')
            ->where('due_date', '<', now());
    }
}
