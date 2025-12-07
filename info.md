1. INTRODUCTION
The Web Admin Panel is the management console used by librarians, staff, and super admins to control all operations of the Smart Library System. It enables:
•	Student verification & approvals
•	Book and inventory management
•	Barcode & QR generation
•	Issuing & returning books
•	Managing academic calendar
•	Viewing statistics, analytics & reports
•	Fine and overdue tracking
The panel must be secure, fast, scalable, and easy to use.
________________________________________
2. PURPOSE
This document defines:
•	Complete functional requirements
•	Non-functional requirements
•	Full tech stack
•	Core modules
•	Workflow details
This ensures the Web Admin Panel is developed as a production-level, coherent, and maintainable system.
________________________________________
3. USERS
3.1 User Roles
Role	Permission Level
Super Admin	Full control of system (colleges, admins, rules)
Library Admin	Manages students, books, issues, returns
Staff	Limited permissions (issue/return, basic operations)
________________________________________
4. TECHNOLOGY STACK
4.1 Frontend (Web Admin Panel)
•	React.js (SPA)
•	React Router
•	Tailwind CSS
•	Bootstrap 5 (Components & Tables)
•	Axios (API Calls)
•	Chart.js / Recharts (Analytics)
•	React Data Table / Bootstrap Table (sorting, filtering, pagination)
•	React QR/Barcode reader (for webcam scanning)
•	JWT Token Handling
4.2 Backend APIs
•	Node.js (Express / NestJS) – API Gateway & Notifications
•	Laravel (PHP) – Main business logic (books, students, loans, cards)
•	Laravel Sanctum/Passport – Authentication
•	Barcode & QR Libraries:
o	Milon Barcode (Laravel)
o	Simple QrCode (BaconQrCode)
4.3 Database
•	MySQL 8
•	InnoDB, UTF8MB4
•	Indexed for:
o	Students
o	Loans
o	Book copies
o	Barcodes
o	Due date queries
4.4 Deployment & Environment
•	Web Server: Nginx / Apache
•	Hosting: AWS / DigitalOcean / Hostinger
•	Containerization: Docker (optional)
•	Version Control: Git + GitHub
•	CI/CD: GitHub Actions (optional)
________________________________________
5. FUNCTIONAL REQUIREMENTS (FR)
(Complete list covering every module – nothing missing)
________________________________________
5.1 Authentication & Authorization
FR1: Admin Login
•	Login using Admin ID + Password
•	JWT authentication tokens
•	Role-based access control
FR2: Admin Registration
•	Only Super Admin can add admins
•	Auto-send credentials to admin email
FR3: Logout
•	Token invalidation
•	Session cleanup
________________________________________
5.2 Dashboard Module
FR4: Display Summary Metrics
Dashboard must show:
•	Total Students
•	Pending Approvals
•	Total Books
•	Total Book Copies
•	Books Issued Today
•	Due Soon
•	Overdue
•	Total Staff
•	Fine Collected (optional)
FR5: Analytics & Charts
Dashboard graphs:
•	Daily issuance chart
•	Monthly borrowing trends
•	Category-wise most borrowed books
•	Department/semester usage stats
________________________________________
5.3 Student Management Module
FR6: View Students List
Search, filter, sort by:
•	Name
•	ID number
•	Department
•	Course
•	Semester
•	Status (Approved/Blocked/Pending)
FR7: Approve/Reject Students
•	Approve pending student registrations
•	Auto-generate library card, barcode, QR
•	Send approval notification to student
FR8: Student Profile View
•	Complete student info
•	Borrowing history
•	Active loans
•	Fines
FR9: Manage Student Status
•	Block/Unblock students
•	Suspend account
•	Force logout
FR10: Reset Password
Admin can reset student login password.
________________________________________
5.4 Library Card Management
FR11: Generate Library Card
•	Auto-generate Card Number
•	Generate Barcode & QR Code
•	Assign to student
FR12: Reissue Card
•	Re-generate card if lost
•	Old card marked inactive
FR13: Print/Download Card
Generate printable PDF card with:
•	Student photo
•	Name
•	ID number
•	Card number
•	Barcode / QR
________________________________________
5.5 Book Management Module
FR14: Add New Book
Input fields:
•	Title
•	Author
•	Edition
•	Publisher
•	ISBN
•	Category
•	Rack & Shelf
•	Course & Semester (if applicable)
•	Cover image
FR15: Update Book Details
•	Edit any book information
•	Replace cover image
FR16: Delete/Archive Book
•	Archive (soft delete) recommended
FR17: View Books List
•	Search by title, author, category
•	Filters: Category, course, availability
________________________________________
5.6 Book Copies & Inventory
FR18: Add Book Copies
•	Add single or bulk copies
•	Auto-generate unique copy codes
•	Auto-generate barcode/QR for each copy
FR19: Track Copy Status
Copy statuses:
•	Available
•	Issued
•	Lost
•	Damaged
FR20: Print Barcode Stickers
Generate printable sheet (PDF) of barcodes.
________________________________________
5.7 Issue & Return Module
FR21: Issue Book
Steps:
1.	Scan/Enter Student Card Barcode
2.	Scan/Enter Book Copy Barcode
3.	Validate:
o	Student status
o	Book availability
o	Loan limit
4.	Confirm issue
5.	Generate due date
6.	Notify student
FR22: Return Book
Steps:
1.	Scan/Enter Book Copy Barcode
2.	System auto-detects:
o	Loan record
o	Student
3.	Check overdue
4.	Calculate fine
5.	Mark as returned
6.	Update book availability
FR23: Manual Override (Super Admin Only)
•	Force return
•	Waive fine
________________________________________
5.8 Loan Tracking
FR24: View All Loans
Filter by:
•	Student
•	Book
•	Issue date
•	Due date
•	Status
FR25: Due Soon
Books due within X days.
FR26: Overdue List
Books not returned by due date.
FR27: Send Reminders
•	Bulk reminder notifications
•	Individual reminders
________________________________________
5.9 Academic Calendar Module
FR28: Add Academic Event
Fields:
•	Title
•	Description
•	Date(s)
•	Type (Holiday, Exam, Library Closed)
FR29: View/Edit/Delete Events**
FR30: Upload Academic Calendar PDF/Image**
Visible on student app.
________________________________________
5.10 Notifications Module
FR31: Send Notifications
Admin can send:
•	Alerts
•	Announcements
•	Due reminders
•	Approval updates
FR32: Notification History**
Log of sent notifications.
________________________________________
5.11 Reports & Analytics
FR33: Export Reports (CSV/PDF)**
Types:
•	Issued books
•	Returned books
•	Overdue list
•	Student-wise report
•	Book-wise report
•	Department usage report
FR34: Fine Collection Report**
________________________________________
5.12 System Administration (Super Admin)
FR35: Manage Admins**
•	Create admins
•	Assign roles
•	Activate/Deactivate
FR36: Global Settings**
•	Loan rules (max books, max days)
•	Fine rules
•	Auto-reminder schedule
FR37: Audit Logs**
Track:
•	Admin actions
•	Issue/Return logs
•	Data changes
________________________________________
6. NON-FUNCTIONAL REQUIREMENTS (NFR)
________________________________________
6.1 Performance Requirements
•	NFR1: All admin pages must load in under 2 seconds.
•	NFR2: API response time < 300 ms on average.
•	NFR3: Book lists must support pagination for thousands of records.
•	NFR4: Barcode scanning must respond in < 500 ms.
________________________________________
6.2 Security Requirements
•	NFR5: Only authenticated users can access admin pages.
•	NFR6: Role-based access control enforced on all modules.
•	NFR7: All communication must use HTTPS.
•	NFR8: Passwords stored using bcrypt/argon2.
•	NFR9: Prevent SQL injection, XSS, CSRF.
________________________________________
6.3 Reliability & Availability
•	NFR10: System uptime ≥ 99%
•	NFR11: Auto-reconnect on network failures
•	NFR12: Retry mechanism for notification delivery
________________________________________
6.4 Usability
•	NFR13: Responsive design: desktop, tablet-friendly
•	NFR14: Clean UI using Tailwind + Bootstrap
•	NFR15: Search & filter should be intuitive and fast
________________________________________
6.5 Maintainability
•	NFR16: Component-based React architecture
•	NFR17: Code must follow ESLint + Prettier standards
•	NFR18: Proper folder structure for scalability
________________________________________
6.6 Scalability
•	NFR19: Backend allows horizontal scaling
•	NFR20: DB indexing for large datasets
•	NFR21: Node.js gateway handles high request volume
________________________________________
6.7 Backup & Recovery
•	NFR22: Daily automated DB backup
•	NFR23: Restore testing every 30 days
•	NFR24: File storage backup (covers, cards, barcodes)
________________________________________
7. MODULE OVERVIEW SUMMARY
Module	Sub-modules
Dashboard	Stats, charts, analytics
Students	Approvals, list, profiles, status, password reset
Library Cards	Generate, reissue, print
Books	CRUD, categorization, search
Book Copies	Add copies, barcodes, status tracking
Issue/Return	Scanning, issuing, overdue handling
Loans	Due soon, overdue, history
Academic Calendar	Events, uploads, view
Notifications	Send, history
Reports	Export, insights
System Admin	Admin roles, settings, audit logs
________________________________________
8. CONCLUSION
This document defines the complete, production-ready specification for the Smart Library Admin Web Panel.
It includes:
•	Full functional clarity
•	All required modules
•	Complete non-functional requirements
•	Modern tech stack
•	Professional-grade detail suitable for real-world development

