5. FUNCTIONAL REQUIREMENTS (FR)
(Complete list covering every feature)
________________________________________
5.1 Authentication Module
FR1: Student Registration
Student must be able to register using:
•	Full Name
•	Phone Number
•	College ID Card Number
•	College/Department/Course/Semester
•	Password
•	Profile Photo (optional)
FR2: Registration Status
After registering:
•	Status = PENDING
•	User cannot log in until approved
FR3: Login
Login using:
•	College ID Card Number
•	Password
FR4: JWT Token Handling
•	Save token in secure storage
•	Auto-refresh token
•	Logout clears session
________________________________________
5.2 Dashboard Module
FR5: Student Dashboard
Shows:
•	Profile summary
•	Library card status
•	Active loans
•	Pending/overdue count
•	Suggested books carousel
•	Announcements
FR6: Dynamic Book Suggestions
Based on:
•	Course & semester
•	Popular books
•	Recently added items
________________________________________
5.3 Digital Library Card Module
FR7: Display digital library card
Shows:
•	Student name
•	Library Card Number
•	Barcode
•	QR Code
•	Validity
•	College ID
FR8: Download Card
Student can download card as:
•	PNG
•	PDF
FR9: Offline Access
Card should still work offline after initial load.
________________________________________
5.4 Book Search & Browsing Module
FR10: Search books
Search by:
•	Title
•	Author
•	ISBN
•	Category
FR11: Filter books
Filter:
•	Available only
•	Category
•	Course/Semester
•	New arrivals
FR12: Book Detail Page
Shows:
•	Cover image
•	Title
•	Description
•	Author
•	ISBN
•	Edition
•	Publisher
•	Shelf location
•	Copies available
________________________________________
5.5 Book Barcode Scanning Module
FR13: Scan book barcode
Using mobile camera:
•	Detect barcode/QR
•	Identify book copy
•	Fetch status (available/issued)
•	Show book details
FR14: Scan student card
Student can scan own card to test.
________________________________________
5.6 Loan Management Module
FR15: View Active Loans
Shows:
•	Book names
•	Issue date
•	Due date
•	Days remaining
•	Overdue status
FR16: Loan History
List of all past borrowed books.
FR17: Fine Calculation Preview
Show “expected fine” if overdue.
________________________________________
5.7 Academic Calendar Module
FR18: Display Academic Events
Events from admin panel:
•	Holidays
•	Exam schedule
•	Library closed days
•	Important announcements
FR19: Download academic calendar PDF
________________________________________
5.8 Notifications Module
FR20: Receive Push Notifications
Types:
•	Registration Approved
•	Book Issued
•	Book Returned
•	Due in 2 days
•	Overdue
•	Library announcements
FR21: View Notification History
Display list inside app.
________________________________________
5.9 Profile & Settings Module
FR22: View Profile
•	Name
•	ID
•	Email (optional)
•	Phone
•	Course & semester
•	Profile photo
FR23: Edit Profile
Allow editing:
•	Phone number
•	Profile photo
FR24: Change Password
FR25: Logout
________________________________________
5.10 Offline Mode (Cache)
FR26: Cached data available offline
Store:
•	Profile
•	Library card
•	Borrowed book list
•	Last book search
FR27: Sync on reconnect
When internet returns, auto-sync:
•	Announcements
•	Calendar
•	Loan status
________________________________________
5.11 Error Handling
FR28: Show error messages
For:
•	No internet
•	Token expired
•	Server down
•	Invalid login
•	Permission denied
FR29: Retry button for network errors
________________________________________
5.12 Admin Panel
FR30: Manage users
•	Add/edit/delete students
•	View user activity logs
FR31: Manage books
•	Add/edit/delete books/copies
•	Set availability status
FR32: Manage announcements/calendar events
•	Create/update/delete events
FR33: Approve pending registrations