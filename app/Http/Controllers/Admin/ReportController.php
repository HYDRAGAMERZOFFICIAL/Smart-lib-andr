<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the system reports.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $timeframe = $request->input('timeframe', 'month');
        
        // Determine date range based on timeframe
        $startDate = null;
        $endDate = Carbon::now();
        
        switch ($timeframe) {
            case 'week':
                // Last week (previous 7 days)
                $startDate = Carbon::now()->subDays(7)->startOfDay();
                break;
            case 'month':
                // Last month (previous calendar month)
                $startDate = Carbon::now()->subMonth()->startOfMonth();
                $endDate = Carbon::now()->subMonth()->endOfMonth();
                break;
            case 'year':
                // Last year (previous calendar year)
                $startDate = Carbon::now()->subYear()->startOfYear();
                $endDate = Carbon::now()->subYear()->endOfYear();
                break;
            case 'all':
                // All time
                $startDate = null;
                break;
            default:
                // Default to last month
                $startDate = Carbon::now()->subMonth()->startOfMonth();
                $endDate = Carbon::now()->subMonth()->endOfMonth();
        }
        
        // User statistics based on timeframe
        // For user counts, we'll show users who were active during the selected period
        // For role and verification status, we'll show the current state
        
        // Get total users registered before or during the selected period
        $totalUsersQuery = User::query();
        if ($timeframe !== 'all' && $endDate) {
            $totalUsersQuery->where('created_at', '<=', $endDate);
        }
        $totalUsers = $totalUsersQuery->count();
        
        // Get new users registered during the selected period
        $newUsersQuery = User::query();
        if ($startDate) {
            $newUsersQuery->where('created_at', '>=', $startDate);
            if ($timeframe !== 'week' && $timeframe !== 'all') {
                $newUsersQuery->where('created_at', '<=', $endDate);
            }
        } else {
            // For "all time", show users registered in the last 30 days
            $newUsersQuery->where('created_at', '>=', Carbon::now()->subDays(30));
        }
        $newUsers = $newUsersQuery->count();
        
        // Get admin and member counts
        $adminCount = User::where('role', 'admin');
        $memberCount = User::where('role', 'member');
        $verifiedCount = User::whereNotNull('email_verified_at');
        $unverifiedCount = User::whereNull('email_verified_at');
        
        // Apply timeframe filter to role and verification counts if not "all time"
        if ($timeframe !== 'all' && $endDate) {
            $adminCount->where('created_at', '<=', $endDate);
            $memberCount->where('created_at', '<=', $endDate);
            $verifiedCount->where('created_at', '<=', $endDate);
            $unverifiedCount->where('created_at', '<=', $endDate);
        }
        
        $userStats = [
            'totalUsers' => $totalUsers,
            'adminCount' => $adminCount->count(),
            'memberCount' => $memberCount->count(),
            'verifiedCount' => $verifiedCount->count(),
            'unverifiedCount' => $unverifiedCount->count(),
            'newUsers' => $newUsers,
        ];
        
        // Transaction statistics
        $months = [];
        $incomeData = [];
        $expenseData = [];
        
        // Set up period display based on timeframe
        if ($timeframe === 'week') {
            // For last week, show each day of the previous week
            $periodStart = Carbon::now()->subDays(7)->startOfDay();
            $periodEnd = Carbon::now()->subDay()->endOfDay(); // Yesterday
            
            // Create a period for each day of the last week
            $period = new \DatePeriod(
                $periodStart,
                new \DateInterval('P1D'),
                $periodEnd->addDay() // Include the end date
            );
            
            foreach ($period as $date) {
                $months[] = $date->format('D'); // Day name
                
                $income = Transaction::where('type', 'income')
                    ->whereDate('date', $date->format('Y-m-d'))
                    ->sum('amount');
                    
                $expense = Transaction::where('type', 'expense')
                    ->whereDate('date', $date->format('Y-m-d'))
                    ->sum('amount');
                    
                $incomeData[] = $income;
                $expenseData[] = $expense;
            }
        } elseif ($timeframe === 'month') {
            // For last month, show each day of the previous month
            $lastMonth = Carbon::now()->subMonth();
            $daysInMonth = $lastMonth->daysInMonth;
            $monthStart = $lastMonth->startOfMonth();
            
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $date = $monthStart->copy()->addDays($day - 1);
                $months[] = $date->format('j'); // Day of month (1-31)
                
                $income = Transaction::where('type', 'income')
                    ->whereDate('date', $date->format('Y-m-d'))
                    ->sum('amount');
                    
                $expense = Transaction::where('type', 'expense')
                    ->whereDate('date', $date->format('Y-m-d'))
                    ->sum('amount');
                    
                $incomeData[] = $income;
                $expenseData[] = $expense;
            }
        } elseif ($timeframe === 'year') {
            // For last year, show each month of the previous year
            $lastYear = Carbon::now()->subYear()->year;
            
            for ($month = 1; $month <= 12; $month++) {
                $date = Carbon::createFromDate($lastYear, $month, 1);
                $months[] = $date->format('M'); // Month name
                
                $income = Transaction::where('type', 'income')
                    ->whereYear('date', $lastYear)
                    ->whereMonth('date', $month)
                    ->sum('amount');
                    
                $expense = Transaction::where('type', 'expense')
                    ->whereYear('date', $lastYear)
                    ->whereMonth('date', $month)
                    ->sum('amount');
                    
                $incomeData[] = $income;
                $expenseData[] = $expense;
            }
        } elseif ($timeframe === 'all') {
            // For all time, show data by year
            $firstTransaction = Transaction::orderBy('date', 'asc')->first();
            $lastTransaction = Transaction::orderBy('date', 'desc')->first();
            
            if ($firstTransaction && $lastTransaction) {
                $startYear = Carbon::parse($firstTransaction->date)->year;
                $endYear = Carbon::parse($lastTransaction->date)->year;
                
                for ($year = $startYear; $year <= $endYear; $year++) {
                    $months[] = (string)$year;
                    
                    $income = Transaction::where('type', 'income')
                        ->whereYear('date', $year)
                        ->sum('amount');
                        
                    $expense = Transaction::where('type', 'expense')
                        ->whereYear('date', $year)
                        ->sum('amount');
                        
                    $incomeData[] = $income;
                    $expenseData[] = $expense;
                }
            } else {
                // No transactions, show empty chart
                $months = ['No Data'];
                $incomeData = [0];
                $expenseData = [0];
            }
        }
        
        // Apply timeframe filter to transaction stats
        $transactionQuery = Transaction::query();
        if ($startDate) {
            $transactionQuery->where('date', '>=', $startDate);
            if ($timeframe !== 'week' && $timeframe !== 'all') {
                $transactionQuery->where('date', '<=', $endDate);
            }
        }
        
        $transactionStats = [
            'labels' => $months,
            'incomeData' => $incomeData,
            'expenseData' => $expenseData,
            'totalTransactions' => $transactionQuery->count(),
            'avgAmount' => $transactionQuery->avg('amount') ? round($transactionQuery->avg('amount'), 2) : 0,
        ];
        
        // Category statistics with timeframe filter
        $categoryQuery = Category::withCount(['transactions' => function ($query) use ($startDate, $endDate, $timeframe) {
            if ($startDate) {
                $query->where('date', '>=', $startDate);
                if ($timeframe !== 'week' && $timeframe !== 'all') {
                    $query->where('date', '<=', $endDate);
                }
            }
        }]);
        
        $categories = $categoryQuery
            ->orderBy('transactions_count', 'desc')
            ->take(5)
            ->get();
            
        $categoryStats = [
            'labels' => $categories->pluck('name')->toArray(),
            'data' => $categories->pluck('transactions_count')->toArray(),
        ];
        
        return Inertia::render('Admin/Reports', [
            'userStats' => $userStats,
            'transactionStats' => $transactionStats,
            'categoryStats' => $categoryStats,
            'timeframe' => $timeframe, // Pass the timeframe to the frontend
        ]);
    }
}
