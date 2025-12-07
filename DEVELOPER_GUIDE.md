# Developer Guide

Quick reference for developers working with the Smart Library Student Module.

---

## 🚀 Getting Started

### Prerequisites
```bash
# Check Node.js
node --version   # Should be v18+

# Check PHP
php --version    # Should be 8.1+

# Check MySQL
mysql --version  # Should be 5.7+
```

### First-Time Setup
```bash
# Install dependencies
npm install          # Frontend
composer install     # Backend

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate:fresh --seed

# Start servers
# Terminal 1:
php artisan serve --host=Smart-lib-web.test --port=8000

# Terminal 2:
npm run dev
```

---

## 📂 Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AdminConnectionController.php
│   │   ├── LoansController.php
│   │   ├── DashboardController.php
│   │   ├── AuthController.php
│   │   └── BooksController.php
│   ├── Middleware/
│   │   ├── AdminApiMiddleware.php
│   │   └── HandleInertiaRequests.php
│   └── Requests/
├── Models/
│   ├── User.php
│   ├── Book.php
│   ├── IssuedBook.php
│   ├── Notification.php
│   ├── LibraryCard.php
│   └── AcademicCalendar.php
└── ...

config/
├── app.php
├── database.php
├── services.php        # Admin connectivity config
└── ...

database/
├── migrations/
│   ├── 2024_01_01_000001_create_users_table.php
│   ├── 2024_01_01_000002_create_books_table.php
│   ├── 2024_01_01_000003_create_issued_books_table.php
│   └── ...
├── seeders/
│   └── StudentSeeder.php

resources/
├── js/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Loans.tsx
│   │   ├── AdminConnection.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ...
│   ├── layouts/
│   │   └── Layout.tsx
│   ├── types/
│   │   └── index.ts
│   └── app.tsx
└── css/
    └── app.css

routes/
├── web.php
└── console.php

storage/
├── logs/              # Application logs
└── admin_sync.json    # Admin sync tracking
```

---

## 💻 Common Development Tasks

### Add a New Student Page

**1. Create React Component:**
```bash
# resources/js/pages/NewPage.tsx
import React from 'react';
import Layout from '@/layouts/Layout';
import { usePage } from '@inertiajs/react';

export default function NewPage() {
  const page = usePage();
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold">New Page</h1>
        {/* Page content */}
      </div>
    </Layout>
  );
}
```

**2. Create Controller (if needed data):**
```bash
# app/Http/Controllers/NewPageController.php
php artisan make:controller NewPageController
```

**3. Add Route:**
```php
// routes/web.php
Route::get('/new-page', fn() => inertia('NewPage'))->name('new-page');

// Or with controller:
Route::get('/new-page', [NewPageController::class, 'index'])->name('new-page');
```

**4. Test:**
```
Visit http://Smart-lib-web.test:8000/new-page
```

---

### Add a New API Endpoint

**1. Create Controller Method:**
```php
// app/Http/Controllers/MyController.php
public function getData() {
    return response()->json([
        'data' => 'value'
    ]);
}
```

**2. Add Route:**
```php
// routes/web.php
Route::get('/api/my-endpoint', [MyController::class, 'getData']);

// For admin-only:
Route::get('/api/admin/my-endpoint', [MyController::class, 'adminData'])
    ->middleware('admin.api');
```

**3. Test with cURL:**
```bash
curl -X GET http://Smart-lib-web.test:8000/api/my-endpoint \
  -H "X-Admin-API-Key: your-key" \
  -H "X-Admin-Secret: your-secret"
```

---

### Add a Database Migration

**1. Create Migration:**
```bash
php artisan make:migration create_new_table
```

**2. Write Migration:**
```php
public function up() {
    Schema::create('new_table', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->timestamps();
    });
}
```

**3. Run Migration:**
```bash
php artisan migrate
```

**4. Create Model:**
```bash
php artisan make:model NewTable
```

---

### Add TypeScript Types

**1. Update types/index.ts:**
```typescript
export interface NewModel {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
```

**2. Use in Components:**
```typescript
import { NewModel } from '@/types';

interface Props {
  model: NewModel;
}

export default function MyComponent({ model }: Props) {
  // Component code
}
```

---

## 🔍 Debugging

### Laravel Debugging

**Enable Query Logging:**
```php
// In controller or tinker
DB::enableQueryLog();
// ... your code ...
dd(DB::getQueryLog());
```

**Use Tinker:**
```bash
php artisan tinker

# Then in tinker:
$user = User::find(1);
$user->loans()->count();
```

**Check Logs:**
```bash
tail -f storage/logs/laravel.log
```

### React Debugging

**Browser DevTools:**
1. Open F12 in Chrome/Firefox
2. Go to React DevTools tab
3. Inspect components and props

**Console Logging:**
```typescript
console.log('Debug:', variable);
console.error('Error:', error);
console.table(data);
```

**Vite HMR Debug:**
```bash
# Check browser console for HMR messages
# Vite should show: "vite client connected"
```

---

## 🧪 Testing

### Run Type Check
```bash
npm run type-check
```

### Run Linter
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Format Code
```bash
npm run format
```

### Laravel Testing
```bash
php artisan test

# Specific test
php artisan test tests/Feature/AuthTest.php
```

---

## 📊 Database Queries

### View Database Schema
```bash
php artisan tinker

# List all tables
Schema::getTables()

# Get table columns
Schema::getColumnListing('users')
```

### Common Queries

**Get User with Loans:**
```php
$user = User::with('issuedBooks')->find(1);
$loans = $user->issuedBooks;
```

**Get Overdue Books:**
```php
$overdue = IssuedBook::where('due_date', '<', now())
    ->where('status', 'issued')
    ->get();
```

**Count Stats:**
```php
$stats = [
    'active' => IssuedBook::where('status', 'issued')->count(),
    'overdue' => IssuedBook::where('due_date', '<', now())->count(),
    'fines' => IssuedBook::whereNotNull('fine')->sum('fine'),
];
```

---

## 🔐 Environment Variables

### Essential Variables
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_lib
DB_USERNAME=root
DB_PASSWORD=

# Application
APP_NAME="Smart Library"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://Smart-lib-web.test:8000

# Admin Panel (Add when ready)
ADMIN_PANEL_ENABLED=false
ADMIN_PANEL_API_KEY=your-key
ADMIN_PANEL_SECRET=your-secret
```

---

## 🚀 Building for Production

### Frontend Build
```bash
npm run build

# Output: public/build/
```

### Laravel Optimization
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### Database Backup
```bash
mysqldump -u root smart_lib > backup.sql
```

---

## 📋 Code Style Guidelines

### PHP (Laravel)
```php
// Use PSR-12 style
class MyController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => 'value'
        ]);
    }
}
```

### JavaScript/TypeScript
```typescript
// Use camelCase for variables
const myVariable = 'value';

// Use PascalCase for components
export default function MyComponent() {
  return <div>Content</div>;
}

// Use arrow functions for callbacks
const handler = () => { /* ... */ };
```

### CSS/Tailwind
```css
/* Use utility-first approach */
<div className="flex items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
  {/* Content */}
</div>
```

---

## 🐛 Common Issues & Solutions

### Issue: "vite' is not recognized"
```bash
# Solution:
npm install
npm run dev
```

### Issue: Database connection failed
```bash
# Solution:
# 1. Check MySQL is running
# 2. Verify DB_* variables in .env
# 3. Run: php artisan tinker → DB::connection()->getPdo()
```

### Issue: Hot reload not working
```bash
# Solution:
rm -r node_modules/.vite
npm run dev
```

### Issue: Permission denied error
```bash
# Solution (Windows):
icacls storage /grant Users:F /T
icacls bootstrap/cache /grant Users:F /T
```

### Issue: CSRF token mismatch
```bash
# Solution:
# Make sure cookies are enabled
# Check X-CSRF-TOKEN header is sent
```

---

## 📚 Useful Commands

```bash
# Laravel
php artisan serve                    # Start dev server
php artisan migrate                  # Run migrations
php artisan migrate:fresh --seed     # Reset & seed
php artisan tinker                   # Interactive shell
php artisan make:model Name          # Create model
php artisan make:controller NameController  # Create controller
php artisan make:migration create_table     # Create migration

# NPM
npm install                          # Install dependencies
npm run dev                          # Start dev server
npm run build                        # Production build
npm run type-check                   # TypeScript check
npm run lint                         # Lint code
npm run lint:fix                     # Fix linting issues

# Git
git status                           # Check status
git add .                            # Stage changes
git commit -m "message"              # Commit
git push                             # Push changes
```

---

## 🔗 Useful Resources

- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev
- **Inertia.js**: https://inertiajs.com
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev

---

## 👥 Team Workflow

### Making Changes
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes locally
3. Test thoroughly: `npm run type-check && npm run lint`
4. Commit: `git commit -m "feat: add feature"`
5. Push: `git push origin feature/my-feature`
6. Create pull request

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] No console errors/warnings
- [ ] Tests pass (if applicable)
- [ ] Linting passes
- [ ] UI responsive on mobile
- [ ] No hardcoded values
- [ ] Comments explain complex logic

---

## 🎯 Performance Tips

1. **Database**: Use eager loading with `with()`
2. **React**: Use `useMemo` for expensive calculations
3. **Images**: Optimize and lazy load
4. **CSS**: Tailwind purges unused styles in production
5. **API**: Limit query results, use pagination
6. **Caching**: Use Laravel caching for repeated queries

---

## 🔒 Security Best Practices

1. Never commit `.env` file
2. Validate all user input
3. Use parameterized queries (Eloquent ORM)
4. Enable HTTPS in production
5. Rotate API keys regularly
6. Log security events
7. Keep dependencies updated: `npm audit`
8. Use environment variables for secrets

---

## 📞 Getting Help

1. Check documentation files (START_HERE.md, etc.)
2. Review existing code similar to your task
3. Check Laravel/React documentation
4. Look at error messages carefully
5. Use browser DevTools for client-side issues
6. Check Laravel logs: `storage/logs/`

---

**Happy coding! 🚀**
