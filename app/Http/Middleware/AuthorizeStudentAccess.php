<?php

namespace App\Http\Middleware;

use App\Models\Student;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeStudentAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            abort(401, 'Unauthenticated');
        }

        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            abort(403, 'Student profile not found');
        }

        if ($student->status !== 'approved') {
            abort(403, 'Student account is not approved or is blocked');
        }

        $request->merge(['student' => $student]);

        return $next($request);
    }
}
