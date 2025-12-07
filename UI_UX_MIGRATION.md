# UI/UX Migration Guide - Student Module

This guide explains how to update the UI/UX to match the student module requirements with the dual database architecture.

---

## Overview

The student UI has been converted from an admin-facing system to a student-centric application. This document covers:

- Page structure and navigation
- Component updates
- State management
- Real-time updates from admin database
- Student-specific features

---

## Navigation Structure

### Before (Admin System)
```
Dashboard (admin stats)
├── Students Management
├── Books Management
├── Reports
├── Issue/Return
└── Settings
```

### After (Student System)
```
Dashboard (student summary)
├── Books (search & browse)
├── Library Card (digital card)
├── Loans (active & history)
├── Notifications (messages)
├── Academic Calendar (events)
└── Profile (settings)
```

---

## Page Updates

### 1. Dashboard Page

**Purpose**: Student summary with key information

**Components**:
- Profile summary card
  - Name, ID, department
  - Approval status
- Active loans widget
  - Count of active loans
  - Link to loans page
- Due soon alert
  - Books due in next 3 days
  - Link to manage
- Overdue alert
  - Overdue books (if any)
  - Fine calculation
- Book suggestions carousel
  - Based on course
  - From admin database
- Announcements section
  - Recent library announcements
  - From notifications

**Data Sources**:
- Active loans: `StudentDataRepository::getActiveLoans()`
- Due soon: `StudentDataRepository->countDueSoon()`
- Overdue: `StudentDataRepository->countOverdue()`
- Suggestions: `AdminDataRepository->getBooksByCourse()`
- Announcements: `StudentDataRepository->getNotifications()`

```jsx
// Example React Component
export default function Dashboard({ user, loans, suggestions, announcements }) {
  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProfileCard user={user} />
        <StatCard title="Active Loans" count={loans.length} />
        <StatCard title="Due Soon" count={dueSoonCount} />
      </div>

      {/* Active Loans */}
      <LoansList loans={loans} />

      {/* Book Suggestions */}
      <BookSuggestions books={suggestions} />

      {/* Announcements */}
      <AnnouncementsList announcements={announcements} />
    </div>
  );
}
```

---

### 2. Books Page

**Purpose**: Browse and search library books

**Features**:
- Search functionality
  - By title, author, ISBN
- Filters
  - By category
  - By course/semester
  - Available only toggle
- Book list display
  - Cover image
  - Title, author
  - Availability status
  - Link to details
- Book detail modal
  - Full information
  - Barcode scanning button

**Data Source**: `AdminDataRepository` (read-only)

```jsx
export default function Books({ books, categories }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = books.filter(book => {
    if (searchTerm && !book.title.includes(searchTerm)) return false;
    if (category && book.category !== category) return false;
    if (availableOnly && book.available_copies === 0) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex gap-4 items-end">
        <input
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available Only
        </label>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
```

---

### 3. Library Card Page

**Purpose**: Display and manage digital library card

**Features**:
- Card display
  - Student name
  - Library card number
  - Barcode image
  - QR code image
  - Validity dates
  - Student ID
- Download options
  - PNG format
  - PDF format
- Offline access note
  - Card works offline after load

**Data Source**: `StudentDataRepository::getLibraryCard()`

```jsx
export default function LibraryCard({ card }) {
  const handleDownload = async (format) => {
    try {
      const response = await fetch('/api/library-card/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `library-card.${format}`;
      a.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Card Display */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-sm opacity-75">Library Card</h3>
            <p className="text-lg font-bold">{card.card_number}</p>
          </div>
          <img src={card.photo} alt="Photo" className="w-16 h-16 rounded" />
        </div>

        <div className="mb-4">
          <p className="text-sm opacity-75">Student Name</p>
          <p className="text-lg">{card.student_name}</p>
        </div>

        {/* Barcode */}
        <div className="flex justify-center my-4">
          <img src={card.barcode} alt="Barcode" className="h-12" />
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <img src={card.qr_code} alt="QR Code" className="h-20 w-20" />
        </div>

        <div className="flex justify-between text-xs opacity-75">
          <span>Valid from {card.issued_date}</span>
          <span>Expires {card.expiry_date}</span>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleDownload('png')}
          className="flex-1 btn btn-primary"
        >
          Download PNG
        </button>
        <button
          onClick={() => handleDownload('pdf')}
          className="flex-1 btn btn-secondary"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
```

---

### 4. Loans Page

**Purpose**: View and manage book loans

**Features**:
- Tabs
  - Active loans
  - Loan history
- For each loan:
  - Book title
  - Issue date
  - Due date
  - Days remaining / overdue days
  - Status badge
- Quick stats
  - Total active loans
  - Due soon count
  - Overdue count

**Data Source**: `StudentDataRepository` (Loan model)

```jsx
export default function Loans({ activeLoans, history, stats }) {
  const [tab, setTab] = useState('active');

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Active" count={stats.activeLoanCount} />
        <StatCard title="Due Soon" count={stats.dueSoonCount} className="text-yellow-600" />
        <StatCard title="Overdue" count={stats.overdueCount} className="text-red-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('active')}
          className={`px-4 py-2 border-b-2 ${
            tab === 'active' ? 'border-blue-500' : 'border-transparent'
          }`}
        >
          Active ({activeLoans.length})
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 border-b-2 ${
            tab === 'history' ? 'border-blue-500' : 'border-transparent'
          }`}
        >
          History
        </button>
      </div>

      {/* Loan List */}
      {tab === 'active' ? (
        <LoansList loans={activeLoans} isActive={true} />
      ) : (
        <LoansList loans={history} isActive={false} />
      )}
    </div>
  );
}

function LoansList({ loans, isActive }) {
  return (
    <div className="space-y-2">
      {loans.map(loan => (
        <div key={loan.id} className="border rounded-lg p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{loan.bookCopy.book.title}</h4>
              <p className="text-sm text-gray-600">{loan.bookCopy.book.author}</p>
            </div>
            {isActive && (
              <span className={getDueDateBadge(loan.due_date)}>
                {getDaysRemaining(loan.due_date)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
            <div>Issued: {formatDate(loan.issued_date)}</div>
            <div>Due: {formatDate(loan.due_date)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### 5. Notifications Page

**Purpose**: View library notifications and announcements

**Features**:
- Unread notifications tab
  - Marked as unread
  - New indicator
  - Quick actions
- Notification history tab
  - All past notifications
  - Search/filter
  - Archive option
- Notification types
  - Registration approval
  - Book issued
  - Book returned
  - Due reminder
  - Overdue alert
  - Announcements

**Data Source**: `StudentDataRepository::getNotifications()`

```jsx
export default function Notifications({ unread, history }) {
  const [tab, setTab] = useState('unread');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('unread')}
          className={`px-4 py-2 relative ${
            tab === 'unread' ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          Unread
          {unread.length > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {unread.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 ${
            tab === 'history' ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          History
        </button>
      </div>

      <div className="space-y-2">
        {(tab === 'unread' ? unread : history).map(notif => (
          <NotificationCard key={notif.id} notification={notif} />
        ))}
      </div>
    </div>
  );
}
```

---

### 6. Academic Calendar Page

**Purpose**: View library calendar and events

**Features**:
- Calendar view
  - Month/week/day views
  - Color-coded by type
- Event list view
  - Upcoming events
  - Past events
- Event types
  - Holidays
  - Exams
  - Library closed
  - Special events
- Download PDF option

**Data Source**: `AdminDataRepository::getAllAcademicEvents()`

```jsx
export default function AcademicCalendar({ events }) {
  return (
    <div className="space-y-4">
      {/* Download Button */}
      <button className="btn btn-primary">
        Download Calendar (PDF)
      </button>

      {/* Events List */}
      <div className="space-y-2">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const typeColors = {
    holiday: 'bg-red-100 border-red-300',
    exam: 'bg-yellow-100 border-yellow-300',
    library_closed: 'bg-gray-100 border-gray-300',
    event: 'bg-blue-100 border-blue-300'
  };

  return (
    <div className={`border-l-4 p-4 rounded ${typeColors[event.type]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{event.title}</h4>
          {event.description && (
            <p className="text-sm text-gray-600">{event.description}</p>
          )}
        </div>
        <span className="text-sm px-2 py-1 bg-white rounded capitalize">
          {event.type.replace('_', ' ')}
        </span>
      </div>
      <div className="flex gap-4 mt-2 text-sm text-gray-600">
        <span>{formatDate(event.start_date)}</span>
        {event.end_date !== event.start_date && (
          <span>to {formatDate(event.end_date)}</span>
        )}
      </div>
    </div>
  );
}
```

---

### 7. Profile Page

**Purpose**: Student profile management

**Features**:
- Profile information
  - Name
  - Email
  - Phone number
  - Profile photo
- Edit functionality
  - Update name
  - Update phone
  - Upload photo
- Change password section
- Delete account option

**Data Source**: `StudentDataRepository::getStudentProfile()`

```jsx
export default function Profile({ user }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    photo: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/profile', {
        method: 'PATCH',
        body: data
      });
      
      if (response.ok) {
        // Profile updated successfully
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      {/* Profile Photo */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
          className="input"
        />
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="input"
        />
      </div>

      {/* Email (Read-only) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          disabled
          className="input bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="input"
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Save Changes
      </button>
    </form>
  );
}
```

---

## Bottom Navigation

**Structure**:
```
[Home] [Books] [Card] [Loans] [Profile]
```

**Icons & Labels**:
- Home (House icon) → Dashboard
- Books (Book icon) → Books search
- Card (ID Card icon) → Library card
- Loans (History icon) → Loan management
- Profile (User icon) → Profile & settings

---

## Real-time Updates

### Admin Database Changes

When admin updates books/calendar, students see changes immediately:

```jsx
// Use SWR for real-time updates
import useSWR from 'swr';

export function BooksPage() {
  const { data: books, error, isLoading } = useSWR(
    '/api/books',
    fetcher,
    {
      revalidateOnFocus: true,  // Refresh on tab focus
      revalidateOnReconnect: true, // Refresh on reconnect
      refreshInterval: 30000  // Refresh every 30 seconds
    }
  );

  return (
    // Display books
  );
}
```

### Student Data Updates

Use polling or WebSockets for student-specific data:

```jsx
export function LoansPage() {
  const { data: loans } = useSWR(
    '/api/loans',
    fetcher,
    {
      refreshInterval: 60000  // Check every minute
    }
  );

  return (
    // Display loans
  );
}
```

---

## Styling & Theme

### Color Palette

```css
/* Primary Colors */
--primary-blue: #3B82F6
--primary-purple: #8B5CF6

/* Status Colors */
--success-green: #10B981
--warning-yellow: #FBBF24
--danger-red: #EF4444
--info-cyan: #06B6D4

/* Neutrals */
--gray-100: #F3F4F6
--gray-500: #6B7280
--gray-900: #111827
```

### Component Themes

- **Cards**: Light gray backgrounds with subtle shadows
- **Buttons**: Gradient backgrounds (primary blue to purple)
- **Badges**: Color-coded by status
- **Input**: Light border, focus state with blue ring
- **Navigation**: Bottom bar with active indicator

---

## Mobile Responsiveness

### Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Optimizations

- Stack cards vertically
- Full-width buttons
- Large touch targets (48px minimum)
- Bottom navigation instead of sidebar
- Hamburger menu for additional options

---

## Accessibility

### Requirements

- ARIA labels on all interactive elements
- Semantic HTML (buttons, links, forms)
- Keyboard navigation support
- Color contrast ratios (WCAG AA minimum)
- Screen reader support

### Example:

```jsx
<button
  aria-label="Download library card as PDF"
  onClick={handleDownload}
  className="btn btn-primary"
>
  Download PDF
</button>
```

---

## Performance Optimization

### Lazy Loading

```jsx
const BooksPage = lazy(() => import('./pages/BooksPage'));
const LoansPage = lazy(() => import('./pages/LoansPage'));
```

### Image Optimization

```jsx
<img
  src={book.cover_image}
  alt={book.title}
  loading="lazy"
  className="w-32 h-48 object-cover"
/>
```

### Caching Strategy

```
// Browser cache
- Books: 1 hour
- Calendar: 4 hours
- Profile: 5 minutes
- Loans: 1 minute
```

---

## Migration Checklist

- [ ] Update navigation structure
- [ ] Create dashboard component
- [ ] Create books search component
- [ ] Create library card component
- [ ] Create loans management component
- [ ] Create notifications component
- [ ] Create calendar component
- [ ] Create profile component
- [ ] Implement real-time updates
- [ ] Add mobile responsiveness
- [ ] Add accessibility features
- [ ] Optimize performance
- [ ] Test all components
- [ ] Deploy to production

---

For implementation details, see `IMPLEMENTATION_GUIDE.md`
