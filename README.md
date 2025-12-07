# Smart Library Management System - Web Application

A modern web application for managing library operations, built with **Laravel**, **React**, and **Inertia.js**.

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Inertia.js** for seamless server-driven UI
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hot Toast** for notifications

### Backend
- **Laravel 11** (PHP framework)
- **MySQL** for database
- **Sanctum** for authentication (if needed)
- **Vite** for build tooling

## 📋 Prerequisites

- PHP >= 8.1
- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 5.7 or MariaDB
- Composer >= 2.0

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Smart-lib-andr
```

### 2. Install Dependencies

**PHP/Laravel Dependencies:**
```bash
composer install
```

**Node/React Dependencies:**
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate
```

### 4. Database Setup
```bash
# Create MySQL database
mysql -u root -e "CREATE DATABASE smart_lib;"

# Run migrations
php artisan migrate

# (Optional) Seed sample data
php artisan db:seed
```

## 💻 Running the Application

### Development Mode

**Terminal 1 - Laravel Backend (Port 8000):**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server (Port 5173):**
```bash
npm run dev
```

The app will be available at `http://localhost:8000`

### Production Build
```bash
npm run build
php artisan config:cache
```

## 📁 Project Structure

```
smart-lib-andr/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Request handlers
│   │   └── Requests/         # Form validation
│   ├── Models/               # Database models
│   └── Services/             # Business logic
├── database/
│   ├── migrations/           # Database schema
│   ├── seeders/              # Sample data
│   └── factories/            # Model factories
├── resources/
│   ├── js/
│   │   ├── pages/            # React page components
│   │   ├── components/       # Reusable components
│   │   ├── layouts/          # Layout templates
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   └── app.tsx           # React entry point
│   ├── css/
│   │   └── app.css           # Global styles
│   └── views/
│       └── app.blade.php     # Blade template
├── routes/
│   └── web.php               # Web routes
├── public/                   # Public assets
├── storage/                  # File storage
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── composer.json             # PHP dependencies
├── package.json              # Node dependencies
└── .env                      # Environment variables
```

## 🔑 Key Features

### Authentication
- Student registration with approval workflow
- Login with ID number and password
- Session management

### Dashboard
- Active loans overview
- Overdue books tracking
- Fines calculation
- Recently added books

### Book Management
- Browse library catalog
- Search by title, author, ISBN
- Filter by category, availability
- View detailed book information

### Library Card
- Digital library card display
- Barcode & QR code generation
- Download as PDF/PNG

### Loan Management
- View active loans
- Track due dates
- Overdue alerts
- Fine management

### Additional Features
- Academic calendar
- Notifications system
- User profile management
- Responsive design

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
php artisan serve       # Start Laravel server

# Production
npm run build            # Build for production
php artisan config:cache # Optimize Laravel

# Code Quality
npm run lint            # Check code with ESLint
npm run lint:fix        # Auto-fix lint issues
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier

# Database
php artisan migrate     # Run migrations
php artisan migrate:reset  # Reset database
php artisan db:seed     # Seed database
```

## 🔐 Security Features

- CSRF protection via middleware
- SQL injection prevention with parameterized queries
- Password hashing with bcrypt
- Secure session management
- CORS configuration
- Input validation and sanitization

## 📊 Database Models

- **User** - Student profiles with approval status
- **Book** - Library catalog with inventory
- **IssuedBook** - Loan tracking and fine calculation
- **LibraryCard** - Digital library cards
- **AcademicCalendar** - Events and holidays
- **Notification** - User notifications

## 🧪 Testing

```bash
# Run tests
php artisan test

# With coverage
php artisan test --coverage
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
php artisan serve --port=8001
```

### Database Connection Error
1. Check `.env` database credentials
2. Ensure MySQL is running
3. Verify database exists: `SHOW DATABASES;`

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Composer Issues
```bash
composer dump-autoload
composer install --no-dev
```

## 📚 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout

### Books
- `GET /books` - List all books
- `GET /books/{id}` - Get book details

### Dashboard
- `GET /dashboard` - Dashboard data

### Profile
- `GET /profile` - User profile
- `PUT /profile` - Update profile

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review code comments
3. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: December 2024
