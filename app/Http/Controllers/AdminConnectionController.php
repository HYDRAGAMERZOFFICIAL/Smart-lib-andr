<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\IssuedBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminConnectionController extends Controller
{
    public function status()
    {
        return Inertia::render('AdminConnection', [
            'connection' => [
                'enabled' => config('services.admin_panel.enabled'),
                'url' => config('services.admin_panel.url'),
                'lastSync' => $this->getLastSyncTime(),
                'dataTracking' => [
                    'studentEnrollment' => true,
                    'bookLoans' => true,
                    'bookReturns' => true,
                    'fines' => true,
                ]
            ]
        ]);
    }

    public function getLastSyncTime()
    {
        $syncFile = storage_path('admin_sync.json');
        if (file_exists($syncFile)) {
            $data = json_decode(file_get_contents($syncFile), true);
            return $data['last_sync'] ?? null;
        }
        return null;
    }

    public function studentData()
    {
        $user = Auth::user();
        
        if (!$user || !$user->is_approved) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'student' => [
                'id' => $user->id,
                'id_number' => $user->id_number,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'department' => $user->department,
                'semester' => $user->semester,
                'is_approved' => $user->is_approved,
                'created_at' => $user->created_at,
            ],
            'loans' => [
                'active' => IssuedBook::where('user_id', $user->id)
                    ->where('status', 'issued')
                    ->count(),
                'overdue' => IssuedBook::where('user_id', $user->id)
                    ->where('status', 'issued')
                    ->where('due_date', '<', now())
                    ->count(),
                'totalFines' => IssuedBook::where('user_id', $user->id)
                    ->whereNotNull('fine')
                    ->sum('fine') ?? 0,
            ],
            'records' => IssuedBook::where('user_id', $user->id)
                ->with('book')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($record) {
                    return [
                        'id' => $record->id,
                        'book_id' => $record->book_id,
                        'book_title' => $record->book?->title,
                        'issued_date' => $record->issued_date,
                        'due_date' => $record->due_date,
                        'returned_date' => $record->returned_date,
                        'status' => $record->status,
                        'fine' => $record->fine,
                    ];
                })
        ]);
    }

    public function allStudentsData()
    {
        if (!$this->validateAdminRequest()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $students = User::where('is_approved', true)->get();
        
        $studentsData = $students->map(function ($student) {
            return [
                'id' => $student->id,
                'id_number' => $student->id_number,
                'name' => $student->name,
                'email' => $student->email,
                'phone' => $student->phone,
                'department' => $student->department,
                'semester' => $student->semester,
                'is_approved' => $student->is_approved,
                'created_at' => $student->created_at,
                'active_loans' => IssuedBook::where('user_id', $student->id)
                    ->where('status', 'issued')
                    ->count(),
                'overdue_books' => IssuedBook::where('user_id', $student->id)
                    ->where('status', 'issued')
                    ->where('due_date', '<', now())
                    ->count(),
                'total_fines' => IssuedBook::where('user_id', $student->id)
                    ->whereNotNull('fine')
                    ->sum('fine') ?? 0,
            ];
        });

        $this->recordSync();

        return response()->json([
            'students' => $studentsData,
            'total' => $studentsData->count(),
            'timestamp' => now(),
        ]);
    }

    public function pendingApprovals()
    {
        if (!$this->validateAdminRequest()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $pending = User::where('is_approved', false)->get();

        return response()->json([
            'pending' => $pending->map(function ($user) {
                return [
                    'id' => $user->id,
                    'id_number' => $user->id_number,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'department' => $user->department,
                    'semester' => $user->semester,
                    'created_at' => $user->created_at,
                ];
            }),
            'total' => $pending->count(),
        ]);
    }

    public function studentLoans($studentId)
    {
        if (!$this->validateAdminRequest()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $loans = IssuedBook::where('user_id', $studentId)
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'book_id' => $record->book_id,
                    'book_title' => $record->book?->title,
                    'book_author' => $record->book?->author,
                    'isbn' => $record->book?->isbn,
                    'issued_date' => $record->issued_date,
                    'due_date' => $record->due_date,
                    'returned_date' => $record->returned_date,
                    'status' => $record->status,
                    'fine' => $record->fine,
                ];
            });

        return response()->json([
            'loans' => $loans,
            'total' => $loans->count(),
        ]);
    }

    protected function validateAdminRequest()
    {
        if (!config('services.admin_panel.enabled')) {
            return false;
        }

        $apiKey = request()->header('X-Admin-API-Key');
        $secret = request()->header('X-Admin-Secret');

        return $apiKey === config('services.admin_panel.api_key') &&
               $secret === config('services.admin_panel.secret');
    }

    protected function recordSync()
    {
        $syncFile = storage_path('admin_sync.json');
        $data = [
            'last_sync' => now()->toIso8601String(),
            'endpoint' => url('/api/admin/students'),
        ];
        file_put_contents($syncFile, json_encode($data, JSON_PRETTY_PRINT));
    }
}
