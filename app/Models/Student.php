<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'id_number',
        'name',
        'email',
        'phone',
        'department',
        'course',
        'semester',
        'status',
        'address',
        'photo',
        'date_of_birth',
        'guardian_name',
        'guardian_phone',
        'approved_at',
        'rejected_at',
        'blocked_at',
        'rejection_reason'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'blocked_at' => 'datetime',
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'email');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function libraryCard()
    {
        return $this->hasOne(LibraryCard::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function fines()
    {
        return $this->hasMany(Fine::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function issueReturnTransactions()
    {
        return $this->hasMany(IssueReturnTransaction::class);
    }

    public function activeLoans()
    {
        return $this->loans()->where('status', 'active');
    }

    public function overdueLoans()
    {
        return $this->loans()->where('status', 'overdue');
    }

    public function pendingFines()
    {
        return $this->fines()->where('status', 'pending');
    }

    public function approve($approverId = null)
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);

        if ($this->user) {
            $this->user->update([
                'email_verified_at' => now(),
                'is_approved' => true
            ]);
        }

        LibraryCard::generateForStudent($this->id, $approverId);

        return $this;
    }

    public function reject($reason = null, $rejectedById = null)
    {
        $this->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason
        ]);

        if ($this->user) {
            $this->user->delete();
        }

        return $this;
    }

    public function block()
    {
        $this->update([
            'status' => 'blocked',
            'blocked_at' => now()
        ]);

        return $this;
    }

    public function unblock()
    {
        $this->update([
            'status' => 'approved',
            'blocked_at' => null
        ]);

        return $this;
    }
}
