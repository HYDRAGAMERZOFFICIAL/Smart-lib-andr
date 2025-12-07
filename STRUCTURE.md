# Project Structure - Smart Library Management System

## Complete Directory Tree

```
Smart-lib-android/
│
├── 📁 app/                                    # React Native Expo Application
│   ├── src/
│   │   ├── 📁 screens/
│   │   │   ├── auth/
│   │   │   │   └── index.ts
│   │   │   └── main/
│   │   │       └── index.ts
│   │   ├── 📁 components/
│   │   │   ├── common/
│   │   │   │   └── index.ts
│   │   │   ├── book/
│   │   │   └── profile/
│   │   ├── 📁 services/
│   │   │   └── index.ts
│   │   ├── 📁 store/
│   │   │   ├── authStore.ts
│   │   │   └── appStore.ts
│   │   ├── 📁 navigation/
│   │   │   └── index.ts
│   │   ├── 📁 utils/
│   │   │   ├── api.ts
│   │   │   ├── validation.ts
│   │   │   ├── storage.ts
│   │   │   ├── date.ts
│   │   │   ├── logger.ts
│   │   │   └── helpers.ts
│   │   ├── 📁 types/
│   │   │   └── index.ts
│   │   ├── 📁 constants/
│   │   │   └── index.ts
│   │   ├── 📁 hooks/
│   │   │   └── index.ts
│   │   ├── 📁 theme/
│   │   │   ├── theme.ts
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   └── index.tsx
│   ├── 📁 assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   └── package.json
│
├── 📁 backend/                                # Node.js API Gateway
│   ├── src/
│   │   ├── 📁 routes/
│   │   ├── 📁 controllers/
│   │   ├── 📁 middleware/
│   │   ├── 📁 config/
│   │   ├── 📁 utils/
│   │   ├── 📁 types/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── 📁 api-docs/                               # API Documentation
├── 📁 config/                                 # Project Configuration
│
├── 📄 Configuration Files
│   ├── .env                                   # Development environment variables
│   ├── .env.example                           # Environment template
│   ├── .env.production                        # Production variables
│   ├── .npmrc                                 # NPM configuration
│   ├── .eslintrc.json                         # ESLint rules
│   ├── .prettierrc.json                       # Prettier formatting
│   ├── .gitignore                             # Git ignore patterns
│   ├── app.json                               # Expo app manifest
│   ├── app.config.ts                          # Expo TypeScript config
│   ├── babel.config.js                        # Babel transpiler config
│   ├── metro.config.js                        # Metro bundler config
│   ├── jest.config.js                         # Jest testing config
│   ├── jest.setup.js                          # Jest setup file
│   ├── eas.json                               # EAS build config
│   └── tsconfig.json                          # TypeScript config
│
├── 📄 Package Files
│   └── package.json                           # Root dependencies & scripts
│
├── 📄 Documentation
│   ├── README.md                              # Main project documentation
│   ├── QUICK_START.md                         # Quick setup guide
│   ├── SETUP_CHECKLIST.md                     # Setup completion checklist
│   ├── STRUCTURE.md                           # This file
│   ├── Intro.md                               # Project introduction
│   ├── FR.md                                  # Functional requirements
│   ├── NFR.md                                 # Non-functional requirements
│   └── SUMMARY.md                             # Project summary
│
└── 📄 Original Requirements
    ├── info.md.txt                            # Technical architecture info
    ├── Intro.md                               # Project intro
    ├── FR.md                                  # Feature requirements
    └── NFR.md                                 # Quality requirements
```

---

## File Purpose Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Development environment variables |
| `.env.example` | Environment template for new developers |
| `.env.production` | Production environment settings |
| `.npmrc` | NPM package manager configuration |
| `.gitignore` | Git ignore rules |
| `app.json` | Expo manifest (JSON format) |
| `app.config.ts` | Expo manifest (TypeScript format) |
| `babel.config.js` | JavaScript transpiler configuration |
| `metro.config.js` | React Native bundler config |
| `jest.config.js` | Unit test framework configuration |
| `jest.setup.js` | Jest test environment setup |
| `eas.json` | Expo build services configuration |
| `tsconfig.json` | TypeScript compiler options |
| `.eslintrc.json` | Code linting rules |
| `.prettierrc.json` | Code formatting rules |

### Core Application Files

#### Frontend Entry Point
| File | Purpose |
|------|---------|
| `app/src/index.tsx` | Main React entry point with providers |

#### State Management (Zustand Stores)
| File | Purpose |
|------|---------|
| `app/src/store/authStore.ts` | Authentication state management |
| `app/src/store/appStore.ts` | Global app state (theme, language, notifications) |

#### Theme & Styling
| File | Purpose |
|------|---------|
| `app/src/theme/theme.ts` | React Native Paper theme |
| `app/src/theme/colors.ts` | Color palette definitions |
| `app/src/theme/spacing.ts` | Spacing and border radius values |
| `app/src/theme/typography.ts` | Typography styles |

#### Utilities & Helpers
| File | Purpose |
|------|---------|
| `app/src/utils/api.ts` | Axios API client with interceptors |
| `app/src/utils/validation.ts` | Form and input validation functions |
| `app/src/utils/storage.ts` | Secure and local storage utilities |
| `app/src/utils/date.ts` | Date formatting and manipulation |
| `app/src/utils/logger.ts` | Application logger |
| `app/src/utils/helpers.ts` | Common helper functions |

#### Constants & Types
| File | Purpose |
|------|---------|
| `app/src/constants/index.ts` | API endpoints, routes, error messages |
| `app/src/types/index.ts` | TypeScript interfaces and types |

#### Index Files (Barrel Exports)
| File | Purpose |
|------|---------|
| `app/src/screens/auth/index.ts` | Export auth screens |
| `app/src/screens/main/index.ts` | Export main screens |
| `app/src/components/common/index.ts` | Export common components |
| `app/src/services/index.ts` | Export all services |
| `app/src/hooks/index.ts` | Export custom hooks |
| `app/src/navigation/index.ts` | Export navigation components |

#### Backend Entry
| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Express server initialization |
| `backend/package.json` | Backend dependencies |
| `backend/tsconfig.json` | Backend TypeScript config |
| `backend/.env` | Backend environment variables |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation (setup, features, deployment) |
| `QUICK_START.md` | 5-minute quick start guide |
| `SETUP_CHECKLIST.md` | Complete setup checklist with next steps |
| `STRUCTURE.md` | This file - project structure reference |

---

## Directory Organization Details

### `app/src/screens/`
Organized by feature (auth and main):
- `auth/` - Authentication related screens (Login, Register, etc.)
- `main/` - Main app screens (Home, Books, Card, Profile)

**To Add**: LoginScreen.tsx, RegisterScreen.tsx, HomeScreen.tsx, etc.

### `app/src/components/`
Organized by feature/domain:
- `common/` - Reusable UI components (Button, Input, Card, etc.)
- `book/` - Book-specific components (BookCard, BookList, etc.)
- `profile/` - Profile-specific components (ProfileCard, etc.)

**To Add**: Individual component files

### `app/src/services/`
API services for different domains:
- `authService.ts` - Authentication API calls
- `userService.ts` - User profile API calls
- `bookService.ts` - Book browsing API calls
- `loanService.ts` - Loan management API calls
- `cardService.ts` - Library card API calls
- `calendarService.ts` - Academic calendar API calls
- `notificationService.ts` - Notification API calls

**To Add**: Service implementations

### `app/src/utils/`
Pure utility/helper functions:
- `api.ts` - HTTP client
- `validation.ts` - Form validation
- `storage.ts` - Data persistence
- `date.ts` - Date utilities
- `logger.ts` - Logging
- `helpers.ts` - General helpers

✅ **Status**: All completed

### `app/src/store/`
Zustand state management stores:
- `authStore.ts` - Auth state (user, token, isAuthenticated)
- `appStore.ts` - Global app state (theme, language, notifications)

✅ **Status**: Stores initialized

### `app/src/hooks/`
Custom React hooks (to be implemented):
- `useAuth` - Authentication hook
- `useNetworkStatus` - Network connectivity
- `useNotification` - Notification management
- `useLocalStorage` - Local storage wrapper
- `useDebounce` - Debounce hook
- `useAsync` - Async operations

**To Add**: Hook implementations

### `app/src/navigation/`
Navigation setup:
- `RootNavigator.tsx` - Main navigation orchestrator
- `AuthNavigator.tsx` - Authentication stack
- `MainNavigator.tsx` - Main app stack

**To Add**: Navigation implementations

### `backend/src/`
Backend API structure:
- `routes/` - API route definitions
- `controllers/` - Route handlers
- `middleware/` - Express middleware
- `config/` - Configuration
- `utils/` - Helper functions
- `types/` - TypeScript types

**To Add**: Route, controller, and middleware implementations

---

## Path Aliases Reference

All imports use TypeScript path aliases defined in `tsconfig.json`:

```typescript
// Instead of:
import { logger } from '../../../utils/logger';

// Use:
import { logger } from '@utils/logger';
```

### Available Aliases

| Alias | Path |
|-------|------|
| `@/*` | `app/src/*` |
| `@screens/*` | `app/src/screens/*` |
| `@components/*` | `app/src/components/*` |
| `@services/*` | `app/src/services/*` |
| `@store/*` | `app/src/store/*` |
| `@utils/*` | `app/src/utils/*` |
| `@types/*` | `app/src/types/*` |
| `@constants/*` | `app/src/constants/*` |
| `@hooks/*` | `app/src/hooks/*` |
| `@theme/*` | `app/src/theme/*` |
| `@navigation/*` | `app/src/navigation/*` |
| `@assets/*` | `app/assets/*` |

---

## Module Entry Points (Barrel Exports)

Most directories have an `index.ts` file that exports all modules:

```typescript
// app/src/utils/index.ts (if created)
export * from './api';
export * from './validation';
export * from './storage';
// ...

// Usage:
import { apiClient, validateEmail } from '@utils';
```

---

## Asset Organization

### Icons (`app/assets/icons/`)
- App icons
- UI icons
- Navigation icons
- Status icons

### Images (`app/assets/images/`)
- Splash screen
- App logo
- Backgrounds
- Placeholder images

### Fonts (`app/assets/fonts/`)
- Custom fonts (if any)

---

## Backend Organization

```
backend/
├── src/
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── bookRoutes.ts
│   │   └── ...
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── ...
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── ...
│   └── index.ts
└── package.json
```

**To Add**: Route, controller, and middleware implementations

---

## Initialization Status

### ✅ Completed (100%)
- Project structure and directories
- Configuration files
- Core utilities
- Type definitions
- Constants
- State management stores
- Theme configuration
- Documentation

### ⏳ To Be Implemented (0%)
- Screen components
- UI components
- Services/API calls
- Custom hooks
- Navigation setup
- Backend routes and controllers

---

## Quick Statistics

| Category | Count |
|----------|-------|
| Configuration Files | 13 |
| Core Utility Files | 6 |
| Store Files | 2 |
| Theme Files | 4 |
| Index/Export Files | 7 |
| Documentation Files | 7 |
| **Total Files** | **39+** |

---

## Next Implementation Steps

1. **Implement Services** (7 files)
   - authService.ts
   - userService.ts
   - bookService.ts
   - loanService.ts
   - cardService.ts
   - calendarService.ts
   - notificationService.ts

2. **Create Components** (20+ files)
   - Common UI components
   - Screen components
   - Feature-specific components

3. **Setup Navigation** (3 files)
   - RootNavigator.tsx
   - AuthNavigator.tsx
   - MainNavigator.tsx

4. **Implement Hooks** (6 files)
   - useAuth.ts
   - useNetworkStatus.ts
   - useNotification.ts
   - useLocalStorage.ts
   - useDebounce.ts
   - useAsync.ts

5. **Backend Implementation** (10+ files)
   - Routes
   - Controllers
   - Middleware

---

**Last Updated**: December 7, 2024  
**Version**: 0.1.0  
**Status**: Setup Phase Complete ✅
