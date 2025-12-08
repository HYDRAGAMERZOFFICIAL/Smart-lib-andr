<?php

namespace App\Policies;

use App\Models\Fine;
use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FinePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Fine $fine): bool
    {
        $student = Student::where('email', $user->email)->first();
        return $student && $fine->student_id === $student->id;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Fine $fine): bool
    {
        return false;
    }

    public function delete(User $user, Fine $fine): bool
    {
        return false;
    }
}
