# Admin User Guide

This document provides information about the admin functionality in the PERAFINCORE application, including how to create admin users, access admin features, and manage user roles.

## Table of Contents

1. [Admin Role Overview](#admin-role-overview)
2. [Creating Admin Users](#creating-admin-users)
3. [Admin Dashboard](#admin-dashboard)
4. [Managing User Roles](#managing-user-roles)
5. [Admin Middleware](#admin-middleware)
6. [Troubleshooting](#troubleshooting)

## Admin Role Overview

The application supports two user roles:

- **Member**: Regular users with standard permissions (default role)
- **Admin**: Users with elevated privileges who can access administrative features

Admin users are identified by an "Admin" badge next to their name in the navigation bar and have access to the Admin Dashboard.

## Creating Admin Users

### Using the Admin Seeder

The easiest way to create an admin user is to run the AdminUserSeeder:

```bash
php artisan db:seed --class=AdminUserSeeder
```

This will create an admin user with the following credentials:
- **Email**: perafincore@gmail.com
- **Password**: Admin@123

### Running Migrations

If you're setting up the application for the first time, make sure to run migrations first:

```bash
php artisan migrate
```

This will create the necessary database tables and add the `role` column to the users table.

### Using Artisan Commands

You can also promote an existing user to admin using the `user:make-admin` command:

```bash
php artisan user:make-admin user@example.com
```

To demote an admin user back to a regular member:

```bash
php artisan user:remove-admin admin@example.com
```

## Admin Dashboard

The Admin Dashboard provides a central location for administrative functions. To access it:

1. Log in as an admin user
2. Click on your name in the top-right corner
3. Select "Admin Dashboard" from the dropdown menu

Alternatively, you can navigate directly to `/admin/dashboard`.

The Admin Dashboard includes:

### User Management
Access the User Management page to:
- View all registered users
- See user details including name, email, role, and verification status
- Change user roles between admin and member

### System Settings
Access the System Settings page to configure:
- Application name
- Currency symbol
- User registration settings
- Maintenance mode

### System Reports
Access the System Reports page to view:
- User statistics (total users, admin/member counts, verification status)
- Transaction statistics over time
- Category distribution

## Managing User Roles

### User Profile Display

When viewing a user profile, the role is displayed in the "Account Type" field. This is a read-only field that shows whether the account is an "Administrator" or "Member".

### Database Structure

The user role is stored in the `role` column of the `users` table as an enum with two possible values:
- `admin`
- `member`

## Admin Middleware

The application uses middleware to restrict access to admin-only routes. Any route protected by the `admin` middleware will only be accessible to users with the admin role.

Example of a protected route:

```php
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
});
```

## Troubleshooting

### Access Denied to Admin Dashboard

If you're unable to access the Admin Dashboard:

1. Verify that your user account has the admin role:
   ```bash
   php artisan tinker
   App\Models\User::where('email', 'your-email@example.com')->first()->role
   ```

2. If the role is not set to 'admin', promote your user:
   ```bash
   php artisan user:make-admin your-email@example.com
   ```

### Admin User Not Created by Seeder

If the AdminUserSeeder doesn't create an admin user:

1. Check if a user with the email 'admin@example.com' already exists
2. Run the seeder with the `--force` flag:
   ```bash
   php artisan db:seed --class=AdminUserSeeder --force
   ```

### Missing Role Column

If you encounter errors related to the missing `role` column:

1. Make sure you've run the migrations:
   ```bash
   php artisan migrate
   ```

2. If the issue persists, check the migration status:
   ```bash
   php artisan migrate:status
   ```

3. If needed, run the specific migration for adding the role column:
   ```bash
   php artisan migrate --path=database/migrations/2025_05_14_082924_add_role_to_users_table.php
   ```