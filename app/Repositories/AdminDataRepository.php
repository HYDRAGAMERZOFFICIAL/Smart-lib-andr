<?php

namespace App\Repositories;

use App\Models\AdminBook;
use App\Models\AdminAcademicCalendarEvent;

class AdminDataRepository
{
    /**
     * Get all available books (read-only for students)
     */
    public function getAllBooks($paginate = true, $perPage = 20)
    {
        $query = AdminBook::where('is_archived', false);

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get books by category
     */
    public function getBooksByCategory($category, $paginate = true, $perPage = 20)
    {
        $query = AdminBook::byCategory($category)->where('is_archived', false);

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get books by course and semester
     */
    public function getBooksByCourse($course, $semester = null, $paginate = true, $perPage = 20)
    {
        $query = AdminBook::byCourse($course, $semester)->where('is_archived', false);

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get available books only
     */
    public function getAvailableBooks($paginate = true, $perPage = 20)
    {
        $query = AdminBook::available();

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Search books
     */
    public function searchBooks($searchTerm, $paginate = true, $perPage = 20)
    {
        $query = AdminBook::search($searchTerm)->where('is_archived', false);

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get single book by ID
     */
    public function getBook($bookId)
    {
        return AdminBook::where('is_archived', false)->find($bookId);
    }

    /**
     * Get book by barcode
     */
    public function getBookByBarcode($barcode)
    {
        return AdminBook::where('barcode', $barcode)
            ->where('is_archived', false)
            ->first();
    }

    /**
     * Get all academic calendar events
     */
    public function getAllAcademicEvents($paginate = true, $perPage = 20)
    {
        $query = AdminAcademicCalendarEvent::published()->orderBy('start_date');

        if ($paginate) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    /**
     * Get upcoming academic events
     */
    public function getUpcomingAcademicEvents($limit = 10)
    {
        return AdminAcademicCalendarEvent::upcoming()->limit($limit)->get();
    }

    /**
     * Get academic events by type
     */
    public function getAcademicEventsByType($type)
    {
        return AdminAcademicCalendarEvent::byType($type)->published()->orderBy('start_date')->get();
    }

    /**
     * Get academic event by ID
     */
    public function getAcademicEvent($eventId)
    {
        return AdminAcademicCalendarEvent::published()->find($eventId);
    }
}
