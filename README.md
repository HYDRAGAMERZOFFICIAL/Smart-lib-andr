# Smart Library Management System - Mobile App

A comprehensive mobile application for managing library operations and providing students with seamless access to library resources.

## 📱 Technology Stack

### Frontend
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand + React Query
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Scanner**: Expo Camera + Barcode Scanner

### Backend (API Gateway)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Auth**: JWT
- **Real-time**: WebSockets (Socket.io)

## 🚀 Project Structure

```
smart-lib-android/
├── app/                          # React Native Expo app
│   ├── src/
│   │   ├── screens/              # Screen components
│   │   │   ├── auth/             # Login, Register, etc.
│   │   │   └── main/             # Home, Books, Card, Profile
│   │   ├── components/           # Reusable UI components
│   │   ├── services/             # API and business logic
│   │   ├── store/                # Zustand stores
│   │   ├── navigation/           # Navigation configuration
│   │   ├── utils/                # Helper functions
│   │   ├── types/                # TypeScript types
│   │   ├── constants/            # App constants
│   │   ├── hooks/                # Custom React hooks
│   │   └── theme/                # Theme configuration
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   └── package.json
├── backend/                      # Node.js API Gateway
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── controllers/          # Route controllers
│   │   ├── middleware/           # Express middleware
│   │   ├── config/               # Configuration files
│   │   ├── utils/                # Helper functions
│   │   └── types/                # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── api-docs/                     # API documentation
├── config/                       # Project configuration
├── .env                          # Environment variables
├── .env.example                  # Example environment file
└── package.json                  # Root package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI (`npm install -g expo-cli`)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-lib-android
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd app
   npm install
   ```

4. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Setup Database**
   - Create MySQL database: `smart_lib`
   - Update `.env` with database credentials

## 📦 Environment Variables

Create `.env` file in the root directory:

```env
NODE_ENV=development

# Frontend API URLs
EXPO_PUBLIC_API_URL=http://192.168.1.1:3000
EXPO_PUBLIC_ENV=development

# Backend Configuration
API_BASE_URL=http://192.168.1.1:8000
API_GATEWAY_URL=http://192.168.1.1:3000
LARAVEL_API_URL=http://192.168.1.1:8000/api

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=smart-lib-firebase
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=smart-lib-firebase.firebaseapp.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
FIREBASE_APP_ID=your_app_id_here

# Database
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=smart_lib
DATABASE_PORT=3306

# Logging
LOG_LEVEL=debug
ENABLE_MOCK_API=false
```

## 🎯 Available Scripts

### Frontend (app directory)

```bash
npm run dev          # Start Expo dev server
npm start            # Start Expo server
npm run android      # Run on Android device/emulator
npm run ios          # Run on iOS simulator
npm run web          # Run on web browser
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript
npm test             # Run tests
npm run build:android # Build Android APK
npm run build:ios    # Build iOS IPA
```

### Backend (backend directory)

```bash
npm run dev          # Start development server with hot reload
npm start            # Start production server
npm run build        # Build TypeScript
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────┐
│    PRESENTATION LAYER (UI)      │
│   Screens, Components, Theme    │
└─────────────────────────────────┘
               ↓
┌─────────────────────────────────┐
│     STATE MANAGEMENT LAYER      │
│  Zustand Store, React Query     │
└─────────────────────────────────┘
               ↓
┌─────────────────────────────────┐
│      SERVICES LAYER             │
│   Business Logic, API Calls     │
└─────────────────────────────────┘
               ↓
┌─────────────────────────────────┐
│      DATA LAYER                 │
│   Local Storage, Remote APIs    │
└─────────────────────────────────┘
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Encrypted Storage**: Sensitive data stored in encrypted preferences
- **HTTPS/TLS**: All API communications over secure channels
- **Input Validation**: Sanitization of all user inputs
- **Password Hashing**: bcrypt/argon2 for password storage
- **Secure Session Management**: Auto token refresh and logout

## 🎨 UI/UX Features

- **Material Design 3**: Modern Material Design implementation
- **Responsive Design**: Optimized for 5-7 inch screens
- **Dark Mode Support**: Theme switching capability
- **Accessibility**: TTS and voice commands support
- **Multiple Languages**: 8 language support
- **Smooth Animations**: React Native Reanimated

## 📊 Key Modules

### 1. Authentication
- Student registration with approval
- Login with ID + password
- JWT token management
- Password change functionality

### 2. Dashboard
- Profile summary
- Active loans overview
- Overdue alerts
- Book suggestions
- Announcements

### 3. Library Card
- Digital library card display
- Barcode + QR code generation
- Download as PDF/PNG
- Offline access

### 4. Book Management
- Search by title/author/ISBN/category
- Filter by availability/semester
- Detailed book information
- Barcode scanning

### 5. Loan Management
- View active loans
- Loan history
- Due date tracking
- Fine calculation

### 6. Academic Calendar
- Event display
- Holiday management
- Exam schedule
- PDF download

### 7. Notifications
- Push notifications (FCM)
- Notification history
- Multiple notification types
- Real-time updates

## 🔄 API Integration

The app communicates with:
- **Node.js API Gateway** (Main API)
- **Laravel Backend** (Core library logic)
- **Firebase** (Push notifications)

## 💾 Data Persistence

- **Local Storage**: AsyncStorage for general data
- **Secure Storage**: expo-secure-store for sensitive data
- **SQLite Cache**: Room-like local database (via SQLite)
- **Query Cache**: React Query for API response caching

## 🧪 Testing

```bash
# Frontend tests
npm test
npm run test:watch
npm run test:coverage

# Backend tests (in backend directory)
npm test
npm run test:watch
```

## 🚀 Deployment

### Mobile App
1. Build with EAS: `npm run build:android` or `npm run build:ios`
2. Submit to app stores
3. Monitor with EAS Build and Submit

### Backend API
1. Deploy to cloud platform (AWS, Azure, Heroku, etc.)
2. Set environment variables
3. Run database migrations
4. Monitor logs and performance

## 📚 Documentation

- [API Documentation](./api-docs/README.md)
- [Architecture Document](./docs/ARCHITECTURE.md)
- [Setup Guide](./docs/SETUP.md)
- [Contribution Guidelines](./docs/CONTRIBUTING.md)

## 📝 Functional Requirements

See [FR.md](./FR.md) for detailed functional requirements.

## ⚙️ Non-Functional Requirements

See [NFR.md](./NFR.md) for performance, security, and scalability requirements.

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
- Clear cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules && npm install`

**API Connection Issues**
- Check .env configuration
- Verify backend is running
- Check network connectivity

**Build Warnings**
- Update dependencies: `npm update`
- Check for deprecated packages

## 📞 Support

For issues, questions, or contributions, please contact the development team.

## 📄 License

This project is licensed under the MIT License.

---

**Version**: 0.1.0  
**Last Updated**: December 2024
