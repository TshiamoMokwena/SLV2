# Quick Start Guide for Gemini AI Development

## 📋 Before You Begin

### 1. Review Documentation (5 mins)
- [ ] Read `GEMINI_DEVELOPMENT_PROMPT.md` (comprehensive instructions)
- [ ] Review `PROJECT_VERIFICATION_REPORT.md` (accuracy verification)
- [ ] Check `APPLICATION_ANALYSIS.md` (original analysis)

### 2. Set Up Environment Variables (10 mins)

Create `.env` file in project root:

```env
# Firebase Authentication
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Neon PostgreSQL
EXPO_PUBLIC_NEON_DATABASE_URL=

# Google Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=

# Google Cloud Vision OCR
EXPO_PUBLIC_CLOUD_VISION_API_KEY=

# YouTube API
EXPO_PUBLIC_YOUTUBE_API_KEY=

# ImageKit
EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT=
EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY=
EXPO_PUBLIC_IMAGEKIT_PRIVATE_KEY=
```

### 3. Install New Dependencies (5 mins)

```powershell
# Remove old packages
npm uninstall @supabase/supabase-js openai

# Install Firebase
npx expo install firebase

# Install Neon
npm install @neondatabase/serverless

# Install Gemini
npm install @google/generative-ai

# Install ImageKit
npm install imagekitio-react-native

# Verify Expo SDK compatibility
npx expo install --check
```

---

## 🎯 Development Phases Overview

| Phase | Duration | Focus | Testing Required |
|-------|----------|-------|------------------|
| **Phase 1** | 2-3 days | Firebase Auth Migration | ✅ Auth tests + Dev build |
| **Phase 2** | 2-3 days | Onboarding + Neon DB | ✅ DB tests + Dev build |
| **Phase 3** | 2-3 days | Gemini AI Integration | ✅ AI tests + Dev build |
| **Phase 4** | 1-2 days | Video Library (Keep YouTube) | ✅ Integration tests |
| **Phase 5** | 1-2 days | Camera + OCR (Keep existing) | ✅ Device build required |
| **Phase 6** | 1-2 days | ImageKit Past Papers | ✅ PDF tests + Dev build |
| **Phase 7** | 2-3 days | Polish + Production Build | ✅ Full test suite |

**Total Estimated Time**: 2-3 weeks

---

## 🔥 Phase 1 Quick Start (Firebase Auth)

### Step 1: Create Firebase Config (5 mins)

**File**: `lib/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
```

### Step 2: Update AuthProvider (15 mins)

Replace `context/AuthProvider.tsx` content with Firebase auth (see full example in `GEMINI_DEVELOPMENT_PROMPT.md` - Phase 1.3)

### Step 3: Update SignIn Screen (20 mins)

Replace Supabase calls in `app/(auth)/SignIn.tsx` with Firebase (see Phase 1.4)

### Step 4: Update SignUp Screen (20 mins)

Replace Supabase calls in `app/(auth)/SignUp.tsx` with Firebase (see Phase 1.5)

### Step 5: Test (10 mins)

```powershell
# Run Jest tests
npm test

# Start development server
npx expo start --dev-client

# Or build for device
eas build --profile development --platform android
```

---

## 🗄️ Phase 2 Quick Start (Neon Database)

### Step 1: Create Neon Helper (10 mins)

**File**: `lib/neon.ts`

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL!);

export const db = {
  async saveOnboarding(userId: string, schoolLevel: number, gradeRange: number) {
    return await sql`
      INSERT INTO onboarding (user_id, school_level, grade_range)
      VALUES (${userId}, ${schoolLevel}, ${gradeRange})
      ON CONFLICT (user_id) 
      DO UPDATE SET school_level = ${schoolLevel}, grade_range = ${gradeRange}
      RETURNING *
    `;
  },
  
  async getSubjects(schoolLevel: number, gradeRange: number) {
    return await sql`
      SELECT * FROM subjects 
      WHERE school_level = ${schoolLevel} 
      AND grade_range = ${gradeRange}
      ORDER BY subject_name ASC
    `;
  },
  
  // Add more database functions as needed
};

export default sql;
```

### Step 2: Set Up Database Schema (5 mins)

Run these SQL commands in Neon console:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE onboarding (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_level INTEGER NOT NULL,
    grade_range INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    school_level INTEGER NOT NULL,
    grade_range INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subject_videos (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(subject_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Update OnboardingProvider (15 mins)

Replace Supabase queries with `db` helper functions (see Phase 2.3)

### Step 4: Create Onboarding Screens (30 mins)

Implement `School.tsx` and `Grade.tsx` (see Phase 2.4)

---

## 🤖 Phase 3 Quick Start (Gemini AI)

### Step 1: Create Gemini Helper (15 mins)

**File**: `lib/gemini.ts` (full code in Phase 3.2)

### Step 2: Update ChatInputSection (20 mins)

Replace OpenAI with Gemini in `components/ChatInputSection.tsx` (see Phase 3.3)

### Step 3: Update Quiz Questions (20 mins)

Replace OpenAI with Gemini in quiz generation (see Phase 3.4)

---

## ✅ Testing Checklist Per Phase

After each phase, verify:

```powershell
# 1. TypeScript check
npx tsc --noEmit

# 2. Linting check
npm run lint

# 3. Run tests
npm test

# 4. Start dev server (test manually)
npx expo start --dev-client

# 5. Build for device (if camera/hardware needed)
eas build --profile development --platform android
```

---

## 🚨 Common Issues & Quick Fixes

### Issue 1: Firebase Auth Not Working
```typescript
// Check if Firebase is initialized
console.log('Firebase App:', app.name); // Should log '[DEFAULT]'

// Check auth persistence
console.log('Auth instance:', auth.currentUser);
```

### Issue 2: Neon Database Connection Error
```typescript
// Verify connection string format
// Should be: postgresql://user:password@host.neon.tech/dbname?sslmode=require

// Test connection
const test = await sql`SELECT NOW()`;
console.log('DB connected:', test);
```

### Issue 3: Gemini API Invalid Response
```typescript
// Add JSON extraction
const jsonMatch = text.match(/\[[\s\S]*\]/);
if (!jsonMatch) {
  console.error('Raw response:', text);
  throw new Error('Invalid JSON format');
}
```

### Issue 4: Build Fails with Plugin Error
```powershell
# Clear cache and rebuild
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Check plugin compatibility
npx expo-doctor
```

---

## 📱 Build Commands Reference

### Development Build
```powershell
# Local development
npx expo start --dev-client

# Device build (Android)
eas build --profile development --platform android

# Device build (iOS)
eas build --profile development --platform ios
```

### Preview Build
```powershell
# Both platforms
eas build --profile preview --platform all

# Single platform
eas build --profile preview --platform android
```

### Production Build
```powershell
# Both platforms
eas build --profile production --platform all
```

---

## 🎨 UI/UX Quick Reference

### Color Classes (NativeWind)

```tsx
// Primary colors
className="bg-primary text-white"           // Main blue
className="bg-primary-light text-smartLearner-darkBlue"  // Light blue

// Background
className="bg-background-light"              // Light gray
className="bg-background-medium"             // Medium gray

// Text
className="text-smartLearner-darkBlue"       // Dark blue text
className="text-smartLearner-orange"         // Orange accent

// States
className="bg-success"                       // Green (correct)
className="bg-error"                         // Red (incorrect)
className="bg-warning"                       // Orange (warning)
```

### Common Patterns

```tsx
// Card
<View className="bg-white rounded-2xl p-6 shadow-md">

// Button
<TouchableOpacity className="bg-primary p-4 rounded-full">
  <Text className="text-white text-lg font-semibold text-center">
    Button Text
  </Text>
</TouchableOpacity>

// Input
<TextInput 
  className="bg-background-light p-3 rounded-full border border-gray-300"
  placeholder="Enter text..."
/>

// Header
<Text className="text-3xl font-bold text-smartLearner-darkBlue mb-4">
  Screen Title
</Text>
```

---

## 📚 Quick Links

- **Expo Docs**: https://docs.expo.dev/
- **Firebase Docs**: https://firebase.google.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Gemini Docs**: https://ai.google.dev/docs
- **NativeWind Docs**: https://www.nativewind.dev/

---

## 🎯 Success Metrics

Track your progress:

- [ ] Phase 1: Auth working (email + Google OAuth)
- [ ] Phase 2: Onboarding complete + DB queries working
- [ ] Phase 3: Gemini chat + quiz generation working
- [ ] Phase 4: Video player functional
- [ ] Phase 5: Camera scanning homework
- [ ] Phase 6: PDFs loading from ImageKit
- [ ] Phase 7: Production build successful

---

## 💡 Pro Tips

1. **Commit Frequently**: After each working feature
2. **Test Incrementally**: Don't wait until the end
3. **Log Everything**: Use `console.log` liberally during development
4. **Read Errors Carefully**: TypeScript and build errors are usually descriptive
5. **Check Expo Doctor**: Run `npx expo-doctor` if builds fail
6. **Use Dev Client**: Faster iteration than rebuilding constantly

---

**Ready to start? Begin with Phase 1! 🚀**

For detailed instructions, see `GEMINI_DEVELOPMENT_PROMPT.md`
