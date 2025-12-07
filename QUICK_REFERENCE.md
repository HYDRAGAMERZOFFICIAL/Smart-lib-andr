# Quick Reference Guide - Smart Library Web App

## 🚀 Quick Start (2 commands)

```bash
# Terminal 1 - Start Laravel Backend
php artisan serve

# Terminal 2 - Start Vite Dev Server
npm run dev
```

Then open: `http://localhost:8000`

## 📁 File Locations Quick Map

### Creating a New Page
**Location:** `resources/js/pages/MyPage.tsx`

```typescript
import React from 'react';
import Layout from '@/layouts/Layout';

export default function MyPage() {
  return (
    <Layout>
      {/* Your content */}
    </Layout>
  );
}
```

Then add route in `routes/web.php`:
```php
Route::get('/my-page', fn() => inertia('MyPage'));
```

### Creating a New Component
**Location:** `resources/js/components/MyComponent.tsx`

```typescript
import React from 'react';

export default function MyComponent() {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Creating a New Model
**Location:** `app/Models/MyModel.php`

```php
php artisan make:model MyModel -m  # Creates model + migration
```

Then edit migration in `database/migrations/`

### Creating a New Controller
**Location:** `app/Http/Controllers/MyController.php`

```php
php artisan make:controller MyController
```

Then add methods and routes in `routes/web.php`

## 🎨 Tailwind CSS Quick Reference

### Common Classes
```tsx
// Spacing
<div className="p-4 m-6 px-8 py-4">

// Colors
<div className="bg-indigo-600 text-white border-red-500">

// Sizing
<div className="w-full h-screen min-h-96 max-w-2xl">

// Flexbox
<div className="flex justify-between items-center gap-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive
<div className="text-sm md:text-base lg:text-lg">

// Hover & Transitions
<div className="hover:bg-gray-100 transition duration-300">
```

## 🔗 Inertia.js Essentials

### Navigation
```typescript
import { Link } from '@inertiajs/react';

<Link href="/dashboard" className="...">
  Go to Dashboard
</Link>
```

### Forms
```typescript
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing } = useForm({
  email: '',
  password: '',
});

<form onSubmit={(e) => { e.preventDefault(); post('/login'); }}>
  <input onChange={(e) => setData('email', e.target.value)} />
  <button disabled={processing}>Login</button>
</form>
```

### Props from Backend
```typescript
import { usePage } from '@inertiajs/react';

const page = usePage();
const user = page.props.auth?.user;
const books = page.props.books;
```

### Returning Inertia Response from Laravel
```php
// In Controller
return inertia('Dashboard', [
    'stats' => [
        'activeLoans' => 5,
        'overdueBooks' => 2,
    ],
]);
```

## 🛣️ Routes Quick Reference

### Add Public Route
```php
// routes/web.php
Route::get('/help', fn() => inertia('Help'))->name('help');
```

### Add Protected Route
```php
// routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

### Pass Data to Page
```php
// In Controller
return inertia('MyPage', [
    'data' => $data,
    'stats' => $stats,
]);
```

## 💾 Database Quick Commands

```bash
php artisan migrate           # Run all pending migrations
php artisan migrate:reset     # Rollback all migrations
php artisan migrate:refresh   # Reset and re-run
php artisan tinker            # Interactive PHP shell
php artisan db:seed           # Seed database with data
```

## 🧪 Common Tasks

### Add a Button
```tsx
<button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
  Click Me
</button>
```

### Add a Form Input
```tsx
<input 
  type="text"
  value={data.name}
  onChange={(e) => setData('name', e.target.value)}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
/>
```

### Display a Toast Notification
```tsx
import toast from 'react-hot-toast';

toast.success('Success!');
toast.error('Error!');
toast.loading('Loading...');
```

### Add a Table
```tsx
<table className="min-w-full">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-6 py-3 text-left">Column</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr key={item.id} className="border-b">
        <td className="px-6 py-4">{item.name}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Fetch Data
```tsx
import { apiService } from '@/services/api';

// In useEffect or handler
try {
  const response = await apiService.get('/books');
  setBooks(response.data);
} catch (error) {
  toast.error('Failed to fetch books');
}
```

## 📝 TypeScript Types

### Import Types
```tsx
import { User, Book, IssuedBook } from '@/types';

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  // ... other properties
};
```

### Define New Type
```tsx
// In resources/js/types/index.ts
export interface MyType {
  id: number;
  name: string;
  email: string;
}
```

## 🔍 Debug & Troubleshoot

### Check Network Requests
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Look for failed requests
4. Check Response tab for error message

### Check Backend Logs
```bash
# View latest logs
tail -f storage/logs/laravel.log

# Clear logs
php artisan log:clear
```

### Check Frontend Errors
1. Open browser console (F12)
2. Look for red error messages
3. Check Network tab for API failures

### Verify Routes
```bash
# List all routes
php artisan route:list
```

## ⚡ Performance Tips

1. Use `React.memo` for expensive components
2. Use Tailwind CSS utility classes (no custom CSS)
3. Minimize API calls with proper caching
4. Load data in Laravel controller, not frontend
5. Use database eager loading (with relationships)

## 🔒 Security Reminders

1. Never expose sensitive data in props
2. Always validate on backend
3. Use Inertia's `Route.has()` for authorization
4. Hash passwords with `Hash::make()`
5. Use `@csrf` in forms (Inertia handles this)

## 📚 Useful Links

- **Laravel Docs**: https://laravel.com/docs
- **Inertia.js Docs**: https://inertiajs.com
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

## 💡 Code Snippets

### Complete Page Example
```tsx
import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '@/layouts/Layout';
import { Book } from '@/types';
import toast from 'react-hot-toast';

interface BooksPageProps {
  books: Book[];
}

export default function BooksPage({ books }: BooksPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Books</h2>
        
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <Link 
                href={`/books/${book.id}`}
                className="text-indigo-600 hover:underline mt-4 block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
```

### Complete Controller Example
```php
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BooksController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%");
        }

        $books = $query->paginate(12);

        return inertia('Books', [
            'books' => $books,
        ]);
    }
}
```

---

**For more help, refer to main README.md or SETUP_GUIDE.md**
