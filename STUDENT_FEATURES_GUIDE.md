# Student Features Guide

## 📱 Complete Student Portal Feature Overview

This guide explains all features available to students in the Smart Library system.

---

## 🔐 Getting Started

### Registration
**What students do**: Create a new account with their information
**What gets stored**: 
- ID Number (Unique)
- Name
- Email (Unique)
- Phone
- Department
- Course
- Semester
- Date of Birth
- Guardian Name & Phone
- Address
- Password (hashed)

**Validation Rules**:
- ID Number: Unique, max 50 chars
- Name: Required, max 255 chars
- Email: Unique, valid email, max 255 chars
- Phone: Required, max 20 chars
- Department: Required, max 100 chars
- Course: Required, max 100 chars
- Semester: Required, max 2 chars
- Date of Birth: Valid date
- Password: Min 5 chars, max 15 chars
  - Must contain: uppercase, lowercase, number, special char (!@#(){}/.)

**Database Impact**: 
- ✅ CREATES new student record in `students` table
- ✅ DOES NOT alter existing records
- ✅ DOES NOT modify library data

---

## 📚 Browse Books

### View All Books
**Route**: `/books`
**What students see**:
- Book title, author, edition, publisher
- ISBN, category, rack/shelf location
- Cover image, total copies, available copies

**Filters Available**:
- Category
- Course
- Semester
- Available only (shows only books with copies available)

**What students CAN'T do**:
- ❌ Add books
- ❌ Edit book information
- ❌ Delete books
- ❌ Modify copies count

### View Book Details
**Route**: `/books/{id}`
**Information displayed**:
- Full book details
- Number of available copies
- Detailed description
- Location (rack & shelf)

### Search Books
**Route**: `/books/search`
**Search by**:
- Title
- Author  
- ISBN

### Scan Book Barcode
**Route**: `/books/scan-barcode` (POST)
**Purpose**: Quick lookup of book by scanning barcode
**Returns**: Book details for quick access

---

## 🔗 Manage Loans

### View Current Loans
**Route**: `/loans`
**Shows**:
- Books currently borrowed
- Issued date
- Due date
- Current status (active/overdue)
- Fine amount if any

**Filters**:
- Status (active, overdue, returned)

**Alerts**:
- Books due soon (within 3 days)
- Overdue books

**What students CAN'T do**:
- ❌ Issue loans (librarian only)
- ❌ Modify due dates
- ❌ Return books through portal
- ❌ Cancel loans

### View Loan History
**Route**: `/loans/history`
**Shows**:
- All previously returned books
- When they were returned
- How long they were borrowed

---

## 💰 Check Fines

### View Pending Fines
**Route**: `/fines`
**Shows**:
- Amount due
- Reason for fine (overdue, damage, etc.)
- Related book information
- Due date for payment

**Alerts**:
- Total pending fines amount

**What students CAN'T do**:
- ❌ Create fines
- ❌ Modify fine amounts
- ❌ Delete fines
- ❌ Mark as paid (payment module would be separate)

### View Fine Details
**Route**: `/fines/{id}`
**Shows**:
- Complete fine information
- Associated loan details
- Book details

### View Fine History
**Route**: `/fines/history`
**Shows**:
- Previously paid fines
- Previously waived fines
- Payment dates

---

## 🎫 Library Card

### View Library Card
**Route**: `/library-card`
**Shows**:
- Card number
- Student name & ID
- Barcode
- QR code
- Issued & expiry dates
- Student photo

### Download Library Card
**Formats**:
- PNG (image)
- PDF (printable document)

**Use case**: Print or save digital copy for library staff to scan

---

## 👤 Manage Profile

### View Profile
**Route**: `/student/profile`
**Visible information**:
- Name
- Email
- Phone
- Department
- Course
- Semester
- Date of Birth
- Address
- Guardian information
- Photo

**Related information**:
- Active loans count
- Total pending fines
- Active library card status

### Edit Profile
**Route**: `/student/profile/edit` (GET)
**Editable fields**:
- ✅ Name
- ✅ Phone
- ✅ Address
- ✅ Photo (image upload, max 2MB)
- ✅ Guardian name
- ✅ Guardian phone

**Non-editable fields** (Protected):
- ❌ ID Number
- ❌ Email address
- ❌ Department
- ❌ Course
- ❌ Semester
- ❌ Status (student approval status)

### Change Password
**Route**: `/password` (PUT)
**Process**:
1. Provide current password
2. Enter new password (with validation)
3. Confirm new password

**Password Requirements**:
- Minimum 5 characters
- Maximum 15 characters
- Must include uppercase letter
- Must include lowercase letter
- Must include number
- Must include special character (!@#(){}/.)

### Forgot Password
**Route**: `/forgot-password` (GET/POST)
**Process**:
1. Enter email address
2. Check email for reset link
3. Click link and reset password
4. Use new password to login

---

## 📅 Academic Calendar

### View Calendar
**Route**: `/academic-calendar`
**Shows**:
- Important dates
- Holiday schedules
- Semester dates
- Exam dates (if available)

### Download Calendar
**Formats**:
- PDF or other available formats
- Can be printed or saved

---

## 🔔 Notifications

### View Notifications
**Route**: `/notifications`
**Types of notifications**:
- Book return reminders
- Overdue book alerts
- Fine notices
- New books in your course
- Library announcements

### View Notification History
**Route**: `/notifications/history`
**Shows**:
- All past notifications
- When each notification was received

---

## 📊 Dashboard

### Student Dashboard
**Route**: `/student/dashboard`
**Quick overview of**:
- Number of active loans
- Number of overdue loans
- Total pending fines
- Recently borrowed books
- Books due in next 7 days
- Pending fine list

---

## 🚫 What's NOT Available to Students

Students do NOT have access to:
- ❌ Admin dashboard
- ❌ User management
- ❌ Book management/editing
- ❌ Loan issuance (only librarian)
- ❌ Return processing (only librarian)
- ❌ Fine creation (automatic)
- ❌ Student approval/blocking
- ❌ Report generation
- ❌ Settings management
- ❌ Audit logs
- ❌ Database backups
- ❌ System administration

---

## 🔒 Data Protection

### What Data Students Can See
- ✅ Their own profile
- ✅ Their own loans
- ✅ Their own fines
- ✅ Their own library card
- ✅ Public book catalog
- ✅ Academic calendar
- ✅ General notifications

### What Students CAN'T See
- ❌ Other students' profiles
- ❌ Other students' loans
- ❌ Other students' fines
- ❌ Admin user accounts
- ❌ System logs

### Authorization Check
Every request that shows student data is protected by:
1. **Authentication**: Must be logged in
2. **Verification**: Email must be verified
3. **Authorization**: Can only access own data
4. **Policy**: Route policies enforce access control

**Example**: When viewing loans, the system checks:
```
Is user logged in? YES
Is email verified? YES
Does loan belong to this student? YES
→ SHOW loan
```

If any check fails:
```
→ DENY access / Show 403 error
```

---

## 💾 Database Integrity

### What Happens During Student Actions

#### Registration
```
User submits registration form
↓
Server validates input
↓
Creates new record in students table
↓
Account is ready (may require admin approval)
↓
Existing data: UNTOUCHED ✅
```

#### Profile Update
```
User updates phone/address/photo
↓
Server validates new input
↓
Updates only those specific fields
↓
Other student records: UNTOUCHED ✅
Book data: UNTOUCHED ✅
Library data: UNTOUCHED ✅
```

#### Viewing Books/Loans/Fines
```
User clicks view link
↓
Server retrieves data from database
↓
Filters for this student only
↓
Database: NO CHANGES ✅
```

### What NEVER Happens
- ❌ Student cannot delete data
- ❌ Student cannot modify book information
- ❌ Student cannot change loan status
- ❌ Student cannot create/delete fines
- ❌ Student cannot modify other student data
- ❌ Student cannot access admin functions

---

## 🔑 Security Features Protecting You

1. **Password Hashing**: Passwords are encrypted, never stored in plain text
2. **CSRF Protection**: Prevents unauthorized form submissions
3. **Email Verification**: Confirms email ownership before full access
4. **Session Management**: Automatic logout after inactivity
5. **Input Validation**: All form inputs are validated and sanitized
6. **Authorization Policies**: Fine-grained control over who can access what

---

## ✅ Quick Checklist - What I Can Do As A Student

- [x] Create account (register)
- [x] Login with credentials
- [x] Browse all books
- [x] Search for books
- [x] Scan book barcode
- [x] View my current loans
- [x] View my loan history
- [x] Check my fines
- [x] See my library card
- [x] Download library card
- [x] Update my profile info
- [x] Change my password
- [x] View notifications
- [x] View academic calendar
- [x] Reset forgotten password

---

## 📞 When You Need Help

**Can't do something?** Check if it requires admin privileges:
- Issue a book → Librarian (admin)
- Return a book → Librarian (admin)
- Pay fine → Payment system (separate from this portal)
- Get account approved → Librarian (admin)

Contact your librarian for these admin functions.

---

**Remember**: This is a READ-ONLY portal for viewing your information. Actual book loans, returns, and fine payments are handled by library staff in the admin system.
