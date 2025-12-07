# Quick Start Guide - Smart Library Mobile App

Get up and running with Smart Library in 5 minutes! ⚡

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Expo CLI (`npm install -g expo-cli`)

## Step-by-Step Setup

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd Smart-lib-android
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Important: Update API URLs and Firebase credentials
```

### 3. Install Dependencies

**Frontend**:
```bash
npm install
cd app
npm install
cd ..
```

**Backend** (Optional, for local API development):
```bash
cd backend
npm install
cd ..
```

### 4. Start Development

**Mobile App**:
```bash
cd app
npm run dev
```

This will start Expo and show you options to run on:
- Android Emulator: Press `a`
- iOS Simulator: Press `i`
- Web Browser: Press `w`

**Backend API** (if developing locally):
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3000`

## Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (update with your config) |
| `app/src/index.tsx` | App entry point |
| `app/src/constants/index.ts` | API endpoints and constants |
| `app/src/theme/theme.ts` | Theme configuration |
| `app/src/store/` | Zustand stores for state management |

## Useful Commands

```bash
# Frontend (inside app/)
npm run android          # Run on Android
npm run ios             # Run on iOS
npm run web             # Run on web
npm run lint            # Check code quality
npm run format          # Auto-format code
npm run type-check      # Check TypeScript

# Backend (inside backend/)
npm run dev             # Start with hot reload
npm run build           # Compile TypeScript
npm run lint            # Check code quality
```

## Troubleshooting

### Issue: "Cannot find module"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "API connection refused"
1. Check `.env` file for correct API URL
2. Verify backend is running (if local)
3. Check network connectivity

### Issue: "Port already in use"
```bash
# Backend using different port
PORT=3001 npm run dev
```

## Environment Variables Explained

```env
# API Gateway URL
EXPO_PUBLIC_API_URL=http://192.168.1.1:3000

# Backend API URLs
API_BASE_URL=http://192.168.1.1:8000
LARAVEL_API_URL=http://192.168.1.1:8000/api

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d

# Firebase (for push notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key
```

## Project Structure Quick Reference

```
app/src/
├── screens/          # Screen components
├── components/       # Reusable UI components
├── services/         # API calls & business logic
├── store/            # State management (Zustand)
├── utils/            # Helper functions
├── constants/        # App constants
├── types/            # TypeScript types
└── theme/            # UI theme configuration
```

## Next Steps

1. **Run the app**: `npm run dev` in the `app/` directory
2. **Explore the code**: Check out `app/src/` structure
3. **Read full docs**: See `README.md` for comprehensive guide
4. **Implement features**: Start with authentication screens
5. **Create services**: Implement API calls using `@utils/api`

## Common Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes...

# Commit
git add .
git commit -m "feat: add feature description"

# Push
git push origin feature/feature-name

# Create Pull Request on GitHub
```

## Resources

- **React Native Docs**: https://reactnative.dev/
- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Query**: https://tanstack.com/query

## Development Tips

1. **Use TypeScript**: Always define types for better code quality
2. **Path Aliases**: Use `@utils`, `@components`, etc. instead of relative paths
3. **Responsive Design**: Test on different screen sizes
4. **Performance**: Use `React.memo` for expensive components
5. **Error Handling**: Always handle API errors gracefully

## Mobile Testing

### Test User Credentials
- **ID Number**: test123
- **Password**: Test@123456

### Test Card Details
- **Card Number**: 1234567890
- **QR Code**: Can be scanned from library card screen

## Deployment

### Build for Production
```bash
# Android
npm run build:android

# iOS
npm run build:ios

# Both
npm run build:all
```

Builds are handled by Expo Application Services (EAS).

## Getting Help

1. Check `README.md` for comprehensive documentation
2. Review `SETUP_CHECKLIST.md` for what's been completed
3. Look at `FR.md` and `NFR.md` for requirements
4. Check component examples in `app/src/components/`
5. Review API utilities in `app/src/utils/api.ts`

## Questions?

- Create an issue on GitHub
- Contact the development team
- Check existing documentation

---

**Happy Coding!** 🚀

**Version**: 0.1.0  
**Last Updated**: December 2024
