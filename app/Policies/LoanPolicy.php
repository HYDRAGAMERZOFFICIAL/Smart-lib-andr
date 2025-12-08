<?php

namespace App\Policies;

use App\Models\Loan;
use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LoanPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Loan $loan): bool
    {
        $student = Student::where('email', $user->email)->first();
        return $student && $loan->student_id === $student->id;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Loan $loan): bool
    {
        return false;
    }

    public function delete(User $user, Loan $loan): bool
    {
        return false;
    }
}
