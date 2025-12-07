# Smart Library - Web App Setup Guide

This guide will help you set up and run the Smart Library web application locally.

## ✅ Prerequisites Checklist

- [x] PHP >= 8.1 (comes with Laragon)
- [x] MySQL/MariaDB (comes with Laragon)
- [x] Node.js >= 18.0.0
- [x] npm >= 9.0.0
- [x] Composer >= 2.0

## 🚀 Quick Setup (5 minutes)

### Step 1: Start Laragon
Ensure Laragon is running with Apache and MySQL enabled.

### Step 2: Install Dependencies

**Terminal 1 - Install PHP dependencies:**
```bash
cd c:\laragon\www\Smart-lib-andr
composer install
```

**Terminal 2 - Install Node dependencies:**
```bash
npm install
```

### Step 3: Environment Configuration
```bash
# Copy environment file (already created, but refresh if needed)
copy .env.example .env

# Generate Laravel app key
php artisan key:generate
```

### Step 4: Database Setup
```bash
# Create database
mysql -u root -e "CREATE DATABASE smart_lib;"

# Run migrations to create tables
php artisan migrate
```

### Step 5: Run the Application

**Terminal 1 - Start Laravel backend (Port 8000):**
```bash
php artisan serve
```

**Terminal 2 - Start Vite development server (Port 5173):**
```bash
npm run dev
```

## 📍 Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## 📚 Project Structure Overview

### Frontend (React + Inertia.js)
```
resources/
├── js/
│   ├── app.tsx              # React app entry point
│   ├── pages/               # Page components (Login, Dashboard, etc.)
│   ├── components/          # Reusable UI components
│   ├── layouts/             # Layout templates
│   ├── services/            # API client services
│   ├── types/               # TypeScript type definitions
│   └── hooks/               # Custom React hooks
├── css/
│   └── app.css              # Global styles with Tailwind directives
└── views/
    └── app.blade.php        # Blade template for Inertia
```

### Backend (Laravel)
```
app/
├── Http/
│   └── Controllers/         # Route controllers
│       ├── AuthController.php
│       ├── DashboardController.php
│       └── BooksController.php
├── Models/                  # Database models
│   ├── User.php
│   ├── Book.php
│   ├── IssuedBook.php
│   ├── LibraryCard.php
│   ├── AcademicCalendar.php
│   └── Notification.php
└── Services/                # Business logic

database/
├── migrations/              # Database schema
└── seeders/                 # Sample data

routes/
└── web.php                  # Web routes
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `composer.json` | PHP dependencies |
| `package.json` | Node.js dependencies |
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |

## 🛣️ Available Routes

### Public Routes
- `GET /login` - Login page
- `POST /login` - Login submission
- `GET /register` - Registration page
- `POST /register` - Registration submission

### Protected Routes (requires login)
- `GET /dashboard` - Dashboard home
- `GET /books` - Books catalog
- `GET /loans` - Loan management
- `GET /card` - Library card
- `GET /calendar` - Academic calendar
- `GET /notifications` - Notifications
- `GET /profile` - User profile
- `POST /logout` - Logout

## 📝 Common Commands

### Laravel Artisan
```bash
php artisan serve              # Start development server
php artisan migrate            # Run migrations
php artisan tinker             # Interactive PHP shell
php artisan make:model Book    # Create model
php artisan make:controller UserController    # Create controller
php artisan cache:clear        # Clear cache
php artisan config:cache       # Cache configuration
```

### NPM
```bash
npm run dev                     # Start Vite dev server
npm run build                   # Build for production
npm run lint                    # Check code quality
npm run lint:fix                # Fix code issues
npm run format                  # Format code
npm run type-check              # TypeScript type checking
```

## 🔧 Troubleshooting

### Issue: "PHP not found" or "composer not found"
**Solution:** Ensure Laragon is installed and PHP path is in system PATH. Or use full path:
```bash
C:\laragon\bin\php\php-X.X.X\php.exe artisan serve
```

### Issue: "MySQL connection error"
**Solution:** 
1. Start MySQL in Laragon
2. Check `.env` database credentials:
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=smart_lib
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Verify database exists: `mysql -u root -e "SHOW DATABASES;"`

### Issue: "CORS error" or "API not responding"
**Solution:** Ensure both servers are running:
- Laravel: `http://localhost:8000`
- Vite: `http://localhost:5173`

Check `.env` for correct API URL:
```
VITE_API_URL=http://localhost:8000/api
```

### Issue: "Port 8000 already in use"
**Solution:** Use a different port:
```bash
php artisan serve --port=8001
```

### Issue: "npm dependencies error"
**Solution:** Clean reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🗄️ Database Reset

To reset the database and start fresh:
```bash
php artisan migrate:reset
php artisan migrate
php artisan db:seed    # If seeders are implemented
```

## 🔒 Security Notes

1. **Never commit `.env`** - It contains sensitive data
2. **Change APP_KEY** - Already generated, but always set a unique key
3. **Use HTTPS in production** - HTTP only for development
4. **Secure database** - Set strong MySQL password
5. **Update dependencies** - Regularly run `composer update` and `npm update`

## 📱 Login Credentials (Test)

Once seeders are implemented:
```
ID Number: test001
Password: Password@123
```

## 🎯 Next Steps

1. **Implement Database Seeders** - Add sample books, users, etc.
2. **Create API Services** - Implement API calls for data fetching
3. **Add Form Validation** - Backend and frontend validation
4. **Implement Authentication Guards** - Protect routes properly
5. **Add Error Handling** - Global error handler middleware
6. **Setup Logging** - Log important events
7. **Add Testing** - Unit and feature tests

## 📞 Support & Documentation

- **Laravel Documentation**: https://laravel.com/docs
- **React Documentation**: https://react.dev
- **Inertia.js Documentation**: https://inertiajs.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## ✨ Development Tips

1. Use TypeScript strictly for type safety
2. Keep components small and reusable
3. Use Inertia.js `Link` component for navigation
4. Leverage Tailwind CSS utility classes
5. Use `react-hot-toast` for notifications
6. Follow Laravel MVC architecture
7. Validate input both frontend and backend
8. Use database transactions for complex operations

---

**Happy Coding!** 🚀

For issues or questions, refer to the main README.md or contact the team.
