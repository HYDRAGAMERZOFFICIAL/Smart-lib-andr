<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Loan;
use App\Models\Notification;
use App\Models\LibraryCard;

class StudentDataRepository
{
    /**
     * Get student profile by user ID
     */
    public function getStudentProfile($userId)
    {
        return User::find($userId);
    }

    /**
     * Update student profile
     */
    public function updateStudentProfile($userId, array $data)
    {
        $user = User::find($userId);
        if ($user) {
            $user->update($data);
            return $user;
        }
        return null;
    }

    /**
     * Get student's active loans
     */
    public function getActiveLoans($userId)
    {
        return Loan::where('user_id', $userId)
            ->where('status', 'active')
            ->with(['bookCopy.book'])
            ->latest()
            ->get();
    }

    /**
     * Get student's loan history
     */
    public function getLoanHistory($userId, $paginate = true, $perPage = 20)
    {
        $query = Loan::where('user_id', $userId)
            ->where('status', 'returned')
            ->with(['bookCopy.book'])
            ->latest('returned_date');

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get student's library card
     */
    public function getLibraryCard($userId)
    {
        return LibraryCard::where('user_id', $userId)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Get student notifications
     */
    public function getNotifications($userId, $paginate = true, $perPage = 20)
    {
        $query = Notification::where('user_id', $userId)
            ->where('read_at', null)
            ->latest();

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get notification history
     */
    public function getNotificationHistory($userId, $paginate = true, $perPage = 20)
    {
        $query = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc');

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get loans due soon
     */
    public function getLoansDueSoon($userId, $days = 3)
    {
        return Loan::where('user_id', $userId)
            ->where('status', 'active')
            ->whereBetween('due_date', [now(), now()->addDays($days)])
            ->with(['bookCopy.book'])
            ->get();
    }

    /**
     * Get overdue loans
     */
    public function getOverdueLoans($userId)
    {
        return Loan::where('user_id', $userId)
            ->where('status', 'active')
            ->where('due_date', '<', now())
            ->with(['bookCopy.book'])
            ->get();
    }

    /**
     * Count active loans
     */
    public function countActiveLoans($userId)
    {
        return Loan::where('user_id', $userId)
            ->where('status', 'active')
            ->count();
    }

    /**
     * Count due soon
     */
    public function countDueSoon($userId, $days = 3)
    {
        return Loan::where('user_id', $userId)
            ->where('status', 'active')
            ->whereBetween('due_date', [now(), now()->addDays($days)])
            ->count();
    }

    /**
     * Count overdue
     */
    public function countOverdue($userId)
    {
        return Loan::where('user_id', $userId)
            ->where('status', 'active')
            ->where('due_date', '<', now())
            ->count();
    }
}
