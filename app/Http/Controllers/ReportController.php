<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $period = $request->input('period', 'month');
        \Log::info('Report period requested: ' . $period);
        \Log::info('All request parameters: ' . json_encode($request->all()));
        $startDate = null;
        $endDate = null;
        
        // Check if custom date range is provided
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $period = 'custom';
            $startDate = Carbon::parse($request->input('start_date'));
            $endDate = Carbon::parse($request->input('end_date'));
        } else {
            // Set date range based on period
            switch ($period) {
                case 'week':
                    $startDate = Carbon::now()->startOfWeek();
                    $endDate = Carbon::now()->endOfWeek();
                    break;
                case 'month':
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    break;
                case 'quarter':
                    $startDate = Carbon::now()->startOfQuarter();
                    $endDate = Carbon::now()->endOfQuarter();
                    break;
                case 'year':
                    $startDate = Carbon::now()->startOfYear();
                    $endDate = Carbon::now()->endOfYear();
                    break;
                case 'custom':
                    // Default custom range if no dates provided
                    $startDate = Carbon::now()->subMonth();
                    $endDate = Carbon::now();
                    break;
                default:
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
            }
        }
        
        // Get income and expense totals
        $incomeTotals = $user->transactions()
            ->where('type', 'income')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');
            
        $expenseTotals = $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');
            
        // Get category breakdown
        $categoryBreakdown = $user->transactions()
            ->whereBetween('date', [$startDate, $endDate])
            ->select('category_id', 'type', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id', 'type')
            ->with('category')
            ->get()
            ->map(function ($item) use ($incomeTotals, $expenseTotals) {
                return [
                    'category_id' => $item->category_id,
                    'category_name' => $item->category->name,
                    'category_color' => $item->category->color,
                    'type' => $item->type,
                    'total' => $item->total,
                    'percentage' => $item->type === 'income' 
                        ? ($incomeTotals > 0 ? round(($item->total / $incomeTotals) * 100, 1) : 0)
                        : ($expenseTotals > 0 ? round(($item->total / $expenseTotals) * 100, 1) : 0)
                ];
            });
            
        // Get daily/weekly/monthly trends based on period
        $trendInterval = 'day';
        $format = 'Y-m-d';
        
        if ($period === 'month') {
            $trendInterval = 'day';
            $format = 'Y-m-d';
        } else if ($period === 'quarter') {
            $trendInterval = 'week';
            $format = 'Y-W'; // Include year to distinguish weeks across years
        } else if ($period === 'year') {
            $trendInterval = 'month';
            $format = 'Y-m';
        }
        
        $trends = $this->getTrends($user, $startDate, $endDate, $trendInterval, $format);
        
        // Get top spending categories
        $topExpenseCategories = $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('date', [$startDate, $endDate])
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->with('category')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(function ($item) use ($expenseTotals) {
                return [
                    'category_id' => $item->category_id,
                    'category_name' => $item->category->name,
                    'category_color' => $item->category->color,
                    'total' => $item->total,
                    'percentage' => $expenseTotals > 0 ? round(($item->total / $expenseTotals) * 100, 1) : 0
                ];
            });
            
        // Get top income sources
        $topIncomeCategories = $user->transactions()
            ->where('type', 'income')
            ->whereBetween('date', [$startDate, $endDate])
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->with('category')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(function ($item) use ($incomeTotals) {
                return [
                    'category_id' => $item->category_id,
                    'category_name' => $item->category->name,
                    'category_color' => $item->category->color,
                    'total' => $item->total,
                    'percentage' => $incomeTotals > 0 ? round(($item->total / $incomeTotals) * 100, 1) : 0
                ];
            });
            
        return Inertia::render('Reports/Index', [
            'filters' => [
                'period' => $period,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
            'summary' => [
                'income' => $incomeTotals,
                'expense' => $expenseTotals,
                'balance' => $incomeTotals - $expenseTotals,
                'savings_rate' => $incomeTotals > 0 ? round((($incomeTotals - $expenseTotals) / $incomeTotals) * 100, 1) : 0
            ],
            'categoryBreakdown' => $categoryBreakdown,
            'trends' => $trends,
            'topExpenseCategories' => $topExpenseCategories,
            'topIncomeCategories' => $topIncomeCategories
        ]);
    }
    
    private function getTrends($user, $startDate, $endDate, $interval = 'day', $format = 'Y-m-d')
    {
        // Create date periods
        $period = CarbonPeriod::create($startDate, '1 ' . $interval, $endDate);
        
        // Initialize data structure with zeros
        $incomeData = [];
        $expenseData = [];
        $displayLabels = []; // For user-friendly display
        $dateKeys = [];
        
        foreach ($period as $date) {
            // Create user-friendly labels based on interval
            if ($interval === 'day') {
                $displayLabels[] = $date->format('M d');
                $dateKey = $date->format('Y-m-d');
            } elseif ($interval === 'week') {
                $weekNumber = $date->format('W');
                $displayLabels[] = 'Week ' . $weekNumber;
                $dateKey = $date->format('Y') . '-' . $weekNumber;
            } elseif ($interval === 'month') {
                $displayLabels[] = $date->format('M Y');
                $dateKey = $date->format('Y-m');
            } else {
                $displayLabels[] = $date->format('M d');
                $dateKey = $date->format('Y-m-d');
            }
            
            $dateKeys[] = $dateKey;
            $incomeData[$dateKey] = 0;
            $expenseData[$dateKey] = 0;
        }
        
        // Query for income data
        if ($interval === 'day') {
            $incomeResults = $user->transactions()
                ->where('type', 'income')
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE(date) as date_key'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('date_key')
                ->get();
                
            foreach ($incomeResults as $result) {
                $key = $result->date_key;
                if (isset($incomeData[$key])) {
                    $incomeData[$key] = $result->total;
                }
            }
        } elseif ($interval === 'week') {
            $incomeResults = $user->transactions()
                ->where('type', 'income')
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('YEAR(date) as year'),
                    DB::raw('WEEK(date) as week'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('year', 'week')
                ->get();
                
            foreach ($incomeResults as $result) {
                $key = $result->year . '-' . $result->week;
                if (isset($incomeData[$key])) {
                    $incomeData[$key] = $result->total;
                }
            }
        } elseif ($interval === 'month') {
            $incomeResults = $user->transactions()
                ->where('type', 'income')
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE_FORMAT(date, "%Y-%m") as date_key'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('date_key')
                ->get();
                
            foreach ($incomeResults as $result) {
                $key = $result->date_key;
                if (isset($incomeData[$key])) {
                    $incomeData[$key] = $result->total;
                }
            }
        }
        
        // Query for expense data
        if ($interval === 'day') {
            $expenseResults = $user->transactions()
                ->where('type', 'expense')
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE(date) as date_key'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('date_key')
                ->get();
                
            foreach ($expenseResults as $result) {
                $key = $result->date_key;
                if (isset($expenseData[$key])) {
                    $expenseData[$key] = $result->total;
                }
            }
        } elseif ($interval === 'week') {
            $expenseResults = $user->transactions()
                ->where('type', 'expense')
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('YEAR(date) as year'),
                    DB::raw('WEEK(date) as week'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('year', 'week')
                ->get();
                
            foreach ($expenseResults as $result) {
                $key = $result->year . '-' . $result->week;
                if (isset($expenseData[$key])) {
                    $expenseData[$key] = $result->total;
                }
            }
        } elseif ($interval === 'month') {
            $expenseResults = $user->transactions()
                ->where('type', 'expense')
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE_FORMAT(date, "%Y-%m") as date_key'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('date_key')
                ->get();
                
            foreach ($expenseResults as $result) {
                $key = $result->date_key;
                if (isset($expenseData[$key])) {
                    $expenseData[$key] = $result->total;
                }
            }
        }
        
        // Convert associative arrays to indexed arrays in the same order as labels
        $incomeValues = [];
        $expenseValues = [];
        
        foreach ($dateKeys as $key) {
            $incomeValues[] = isset($incomeData[$key]) ? $incomeData[$key] : 0;
            $expenseValues[] = isset($expenseData[$key]) ? $expenseData[$key] : 0;
        }
        
        return [
            'labels' => $displayLabels,
            'income' => $incomeValues,
            'expense' => $expenseValues
        ];
    }
    
    public function categoryAnalysis(Request $request)
    {
        $user = Auth::user();
        $categoryId = $request->input('category_id');
        $period = $request->input('period', 'month');
        $startDate = null;
        $endDate = null;
        
        // Check if custom date range is provided
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $period = 'custom';
            $startDate = Carbon::parse($request->input('start_date'));
            $endDate = Carbon::parse($request->input('end_date'));
        } else {
            // Set date range based on period
            switch ($period) {
                case 'week':
                    $startDate = Carbon::now()->startOfWeek();
                    $endDate = Carbon::now()->endOfWeek();
                    break;
                case 'month':
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    break;
                case 'quarter':
                    $startDate = Carbon::now()->startOfQuarter();
                    $endDate = Carbon::now()->endOfQuarter();
                    break;
                case 'year':
                    $startDate = Carbon::now()->startOfYear();
                    $endDate = Carbon::now()->endOfYear();
                    break;
                case 'custom':
                    // Default custom range if no dates provided
                    $startDate = Carbon::now()->subMonth();
                    $endDate = Carbon::now();
                    break;
                default:
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
            }
        }
        
        // Get the category
        $category = Category::findOrFail($categoryId);
        
        // Get transactions for this category
        $transactions = $user->transactions()
            ->where('category_id', $categoryId)
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->get();
            
        // Get total amount
        $totalAmount = $transactions->sum('amount');
        
        // Get trends for this category
        $trendInterval = 'day';
        $format = 'Y-m-d';
        
        if ($period === 'month') {
            $trendInterval = 'day';
            $format = 'Y-m-d';
        } else if ($period === 'quarter') {
            $trendInterval = 'week';
            $format = 'Y-W'; // Include year to distinguish weeks across years
        } else if ($period === 'year') {
            $trendInterval = 'month';
            $format = 'Y-m';
        }
        
        // Create date periods
        $periodDates = CarbonPeriod::create($startDate, '1 ' . $trendInterval, $endDate);
        
        // Initialize data structure with zeros
        $trendData = [];
        $labels = [];
        $displayLabels = [];
        
        foreach ($periodDates as $date) {
            $dateKey = $date->format($format);
            
            // Create user-friendly display labels
            if ($trendInterval === 'day') {
                $displayLabel = $date->format('M d');
            } elseif ($trendInterval === 'week') {
                $displayLabel = 'Week ' . $date->format('W');
            } elseif ($trendInterval === 'month') {
                $displayLabel = $date->format('M Y');
            } else {
                $displayLabel = $date->format('M d');
            }
            
            $labels[] = $dateKey;
            $displayLabels[] = $displayLabel;
            $trendData[$dateKey] = 0;
        }
        
        // Query for category data
        if ($trendInterval === 'day') {
            $results = $user->transactions()
                ->where('category_id', $categoryId)
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE(date) as date_key'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('date_key')
                ->get();
        } elseif ($trendInterval === 'week') {
            $results = $user->transactions()
                ->where('category_id', $categoryId)
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('YEAR(date) as year'),
                    DB::raw('WEEK(date) as week'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('year', 'week')
                ->get();
                
            // Transform results to match our date keys
            $transformedResults = collect();
            foreach ($results as $result) {
                $dateKey = $result->year . '-' . $result->week;
                $transformedResults->push((object)[
                    'date_key' => $dateKey,
                    'total' => $result->total
                ]);
            }
            $results = $transformedResults;
        } elseif ($trendInterval === 'month') {
            $results = $user->transactions()
                ->where('category_id', $categoryId)
                ->whereBetween('date', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE_FORMAT(date, "%Y-%m") as date_key'),
                    DB::raw('SUM(amount) as total')
                )
                ->groupBy('date_key')
                ->get();
        }
            
        foreach ($results as $result) {
            if (isset($trendData[$result->date_key])) {
                $trendData[$result->date_key] = $result->total;
            }
        }
        
        // Calculate average per period
        $average = count($labels) > 0 ? $totalAmount / count($labels) : 0;
        
        // Compare with previous period
        $previousStartDate = (clone $startDate)->subDays($endDate->diffInDays($startDate) + 1);
        $previousEndDate = (clone $startDate)->subDay();
        
        $previousTotal = $user->transactions()
            ->where('category_id', $categoryId)
            ->whereBetween('date', [$previousStartDate, $previousEndDate])
            ->sum('amount');
            
        $changePercentage = $previousTotal > 0 
            ? round((($totalAmount - $previousTotal) / $previousTotal) * 100, 1) 
            : ($totalAmount > 0 ? 100 : 0);
            
        return Inertia::render('Reports/CategoryAnalysis', [
            'category' => $category,
            'filters' => [
                'period' => $period,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
            'summary' => [
                'total' => $totalAmount,
                'average' => $average,
                'transaction_count' => count($transactions),
                'change_percentage' => $changePercentage
            ],
            'transactions' => $transactions,
            'trends' => [
                'labels' => array_values(array_unique($labels)),
                'displayLabels' => array_values($displayLabels),
                'data' => array_values($trendData),
                'interval' => $trendInterval
            ]
        ]);
    }
    
    public function incomeVsExpense(Request $request)
    {
        $user = Auth::user();
        $period = $request->input('period', 'year');
        $year = $request->input('year', Carbon::now()->year);
        
        // Set date range based on period
        $startDate = Carbon::createFromDate($year, 1, 1)->startOfYear();
        $endDate = Carbon::createFromDate($year, 12, 31)->endOfYear();
        
        // Get monthly data
        $monthlyData = [];
        $labels = [];
        
        for ($month = 1; $month <= 12; $month++) {
            $monthName = Carbon::createFromDate($year, $month, 1)->format('M');
            $labels[] = $monthName;
            
            $monthlyIncome = $user->transactions()
                ->where('type', 'income')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->sum('amount');
                
            $monthlyExpense = $user->transactions()
                ->where('type', 'expense')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->sum('amount');
                
            $monthlySavings = $monthlyIncome - $monthlyExpense;
            $savingsRate = $monthlyIncome > 0 ? round(($monthlySavings / $monthlyIncome) * 100, 1) : 0;
            
            $monthlyData[] = [
                'month' => $monthName,
                'income' => $monthlyIncome,
                'expense' => $monthlyExpense,
                'savings' => $monthlySavings,
                'savings_rate' => $savingsRate
            ];
        }
        
        // Get yearly totals
        $yearlyIncome = $user->transactions()
            ->where('type', 'income')
            ->whereYear('date', $year)
            ->sum('amount');
            
        $yearlyExpense = $user->transactions()
            ->where('type', 'expense')
            ->whereYear('date', $year)
            ->sum('amount');
            
        $yearlySavings = $yearlyIncome - $yearlyExpense;
        $yearlySavingsRate = $yearlyIncome > 0 ? round(($yearlySavings / $yearlyIncome) * 100, 1) : 0;
        
        // Get category breakdown for the year
        $categoryBreakdown = $user->transactions()
            ->whereYear('date', $year)
            ->select('category_id', 'type', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id', 'type')
            ->with('category')
            ->get()
            ->map(function ($item) use ($yearlyIncome, $yearlyExpense) {
                return [
                    'category_id' => $item->category_id,
                    'category_name' => $item->category->name,
                    'category_color' => $item->category->color,
                    'type' => $item->type,
                    'total' => $item->total,
                    'percentage' => $item->type === 'income' 
                        ? ($yearlyIncome > 0 ? round(($item->total / $yearlyIncome) * 100, 1) : 0)
                        : ($yearlyExpense > 0 ? round(($item->total / $yearlyExpense) * 100, 1) : 0)
                ];
            });
            
        return Inertia::render('Reports/IncomeVsExpense', [
            'filters' => [
                'year' => $year,
            ],
            'summary' => [
                'income' => $yearlyIncome,
                'expense' => $yearlyExpense,
                'savings' => $yearlySavings,
                'savings_rate' => $yearlySavingsRate
            ],
            'monthlyData' => $monthlyData,
            'categoryBreakdown' => $categoryBreakdown,
            'chartData' => [
                'labels' => $labels,
                'income' => array_column($monthlyData, 'income'),
                'expense' => array_column($monthlyData, 'expense'),
                'savings' => array_column($monthlyData, 'savings')
            ]
        ]);
    }
}