# Gemini AI: Smart Learner Rebuild - Executive Brief

## 🎯 Mission

Rebuild the Smart Learner mobile application (React Native + Expo) by migrating from Supabase/OpenAI to Firebase/Neon/Gemini while maintaining all existing functionality.

---

## 📋 What You Need to Do

### Input Documents (Read These First)
1. **`GEMINI_DEVELOPMENT_PROMPT.md`** ← Your complete instructions
2. **`QUICK_START_GUIDE.md`** ← Phase-by-phase quick reference
3. **`PROJECT_VERIFICATION_REPORT.md`** ← Accuracy verification
4. **`APPLICATION_ANALYSIS.md`** ← Original analysis

### Current Project State
- ✅ Expo SDK 52 initialized
- ✅ SignIn/SignUp screens created (using Supabase - needs migration)
- ❌ Not yet migrated to Firebase/Neon/Gemini
- ❌ Tests not yet comprehensive
- ❌ Not yet built with EAS

---

## 🔄 Tech Stack Changes

### Replace These
| Old | New | Usage |
|-----|-----|-------|
| Supabase Auth | **Firebase Auth** | Email/password + Google OAuth |
| Supabase PostgreSQL | **Neon PostgreSQL** | User data, subjects, videos |
| Supabase Storage | **ImageKit** | PDF file hosting |
| OpenAI GPT-4/3.5 | **Google Gemini 1.5 Pro** | Chat + quiz generation |

### Keep These (No Changes)
- ✅ React Native + Expo SDK 54
- ✅ Expo Router v4
- ✅ NativeWind v2 (Tailwind CSS)
- ✅ TypeScript
- ✅ React Native Vision Camera v4
- ✅ Google Cloud Vision API (OCR)
- ✅ YouTube Data API v3
- ✅ All existing UI components

---

## 🏗️ Development Phases (2-3 Weeks)

### Phase 1: Firebase Authentication (2-3 days)
**Goal**: Replace Supabase auth in SignIn/SignUp screens

**Tasks**:
1. Install Firebase SDK
2. Create `lib/firebase.ts` config
3. Update `context/AuthProvider.tsx`
4. Migrate `SignIn.tsx` and `SignUp.tsx`
5. Test email/password + Google OAuth
6. Write auth tests
7. **Build**: Development build

**Success**: Users can sign in/up with Firebase

---

### Phase 2: Neon Database + Onboarding (2-3 days)
**Goal**: Connect to Neon, implement onboarding flow

**Tasks**:
1. Install Neon SDK
2. Set up database schema (SQL provided)
3. Create `lib/neon.ts` helper
4. Build `School.tsx` screen
5. Build `Grade.tsx` screen
6. Build `Home.tsx` dashboard
7. Write DB tests
8. **Build**: Development build

**Success**: Users can complete onboarding, see subjects

---

### Phase 3: Gemini AI Integration (2-3 days)
**Goal**: Replace OpenAI with Gemini

**Tasks**:
1. Install Gemini SDK
2. Create `lib/gemini.ts` helper
3. Update `ChatInputSection.tsx` (homework chat)
4. Update `Questions.tsx` (quiz generation)
5. Test AI responses
6. Write AI tests
7. **Build**: Development build

**Success**: AI chat works, quizzes generate correctly

---

### Phase 4: Video Library (1-2 days)
**Goal**: Keep YouTube integration, fetch from Neon

**Tasks**:
1. Update `VideoList.tsx` to use Neon DB
2. Keep YouTube API integration
3. Test video playback
4. **Build**: Development build

**Success**: Videos load and play

---

### Phase 5: Camera + OCR (1-2 days)
**Goal**: Keep existing implementation

**Tasks**:
1. Verify Camera.tsx works
2. Verify OCRConfirm.tsx works
3. Test on physical device
4. **Build**: Device build (camera requires real device)

**Success**: Camera scans homework, OCR extracts text

---

### Phase 6: ImageKit Past Papers (1-2 days)
**Goal**: Replace Supabase Storage with ImageKit

**Tasks**:
1. Install ImageKit SDK
2. Create `lib/imagekit.ts` helper
3. Update `PdfViewer.tsx`
4. Test PDF loading
5. **Build**: Development build

**Success**: PDFs load from ImageKit

---

### Phase 7: Polish + Production (2-3 days)
**Goal**: Final testing and production build

**Tasks**:
1. Run full test suite
2. Fix any remaining bugs
3. UI/UX polish
4. Performance optimization
5. **Build**: Preview build → Production build

**Success**: App ready for app stores

---

## ✅ Quality Checklist (Use This Every Phase)

Before moving to next phase:

- [ ] All TypeScript errors resolved (`npx tsc --noEmit`)
- [ ] All tests passing (`npm test`)
- [ ] No console errors in development
- [ ] Development build succeeds
- [ ] Manual testing completed
- [ ] Code committed to git

---

## 🚨 Critical Rules

### 1. Expo SDK 54 Compatibility
❌ **NEVER** install packages incompatible with Expo SDK 54  
✅ **ALWAYS** check: https://reactnative.directory/  
✅ **USE**: `npx expo install` for auto-compatible versions

### 2. Build Stability
❌ **DON'T** wait until the end to test builds  
✅ **DO** build after every phase  
✅ **USE**: `eas build --profile development`

### 3. Error Handling
❌ **DON'T** ignore errors or use `any` type  
✅ **DO** wrap all API calls in try-catch  
✅ **DO** show user-friendly error messages

### 4. Testing
❌ **DON'T** skip tests  
✅ **DO** write tests for each feature  
✅ **DO** test on real device for camera features

### 5. Camera Testing
❌ **DON'T** test camera on Android emulator (won't work)  
✅ **DO** test on physical device or iOS simulator

---

## 📦 Installation Commands

```powershell
# Remove old dependencies
npm uninstall @supabase/supabase-js openai

# Install new dependencies
npx expo install firebase
npm install @neondatabase/serverless
npm install @google/generative-ai
npm install imagekitio-react-native

# Verify compatibility
npx expo install --check
```

---

## 🔑 Environment Variables Required

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Neon
EXPO_PUBLIC_NEON_DATABASE_URL=

# Gemini
EXPO_PUBLIC_GEMINI_API_KEY=

# Keep existing
EXPO_PUBLIC_CLOUD_VISION_API_KEY=
EXPO_PUBLIC_YOUTUBE_API_KEY=

# ImageKit
EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT=
EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY=
EXPO_PUBLIC_IMAGEKIT_PRIVATE_KEY=
```

---

## 🎨 UI/UX Requirements

### Design Principles
- **Modern Minimalist**: Clean, uncluttered
- **Consistent**: Same spacing, colors, typography throughout
- **Age-Appropriate**: Professional yet engaging (ages 6-18)
- **Touch-Friendly**: Minimum 44x44pt tap targets

### Color Palette (Use NativeWind Classes)
```tsx
bg-primary              // Main blue (#5470FD)
bg-primary-light        // Light blue (#afbcff)
bg-smartLearner-darkBlue // Dark blue (#012866)
bg-smartLearner-orange   // Orange accent (#ff7700)
bg-background-light      // Light gray (#f8f9fa)
bg-success              // Green (#10b981)
bg-error                // Red (#ef4444)
```

---

## 📱 Build Commands Reference

### Development Build
```powershell
npx expo start --dev-client
# or
eas build --profile development --platform android
```

### Preview Build
```powershell
eas build --profile preview --platform all
```

### Production Build
```powershell
eas build --profile production --platform all
```

---

## 🆘 Common Issues & Solutions

### "Package not compatible with Expo SDK 54"
**Solution**: Use `npx expo install <package>` instead of `npm install`

### "Firebase auth not persisting"
**Solution**: Ensure `initializeAuth` uses `getReactNativePersistence(AsyncStorage)`

### "Gemini returns invalid JSON"
**Solution**: Use regex to extract JSON: `text.match(/\[[\s\S]*\]/)`

### "Build fails with plugin error"
**Solution**: Run `npx expo start -c` to clear cache

### "Camera permissions not working"
**Solution**: Rebuild app after changing `app.json` permissions

---

## 📊 Success Metrics

You'll know you're done when:

✅ Users can sign in with email/password (Firebase)  
✅ Users can sign in with Google OAuth (Firebase)  
✅ Onboarding flow saves to Neon database  
✅ Home dashboard loads subjects from Neon  
✅ AI chat with Gemini works  
✅ Quiz generation with Gemini works  
✅ Videos play from YouTube  
✅ Camera scans homework  
✅ OCR extracts text  
✅ PDFs load from ImageKit  
✅ All tests pass  
✅ Development build succeeds  
✅ Preview build succeeds  
✅ Production build succeeds  
✅ No crashes or errors  

---

## 🎯 Your First Steps

1. **Read** `GEMINI_DEVELOPMENT_PROMPT.md` (comprehensive guide)
2. **Set up** environment variables (`.env` file)
3. **Install** new dependencies (Firebase, Neon, Gemini, ImageKit)
4. **Start** Phase 1 (Firebase Auth migration)
5. **Test** after each phase
6. **Build** after each phase
7. **Document** any issues or questions

---

## 💡 Pro Tips

1. **Commit frequently** - After each working feature
2. **Test incrementally** - Don't wait until the end
3. **Read error messages** - They're usually helpful
4. **Use console.log** - Debug liberally
5. **Check Expo Doctor** - Run `npx expo-doctor` if stuck
6. **Ask for help** - If truly blocked, document the issue

---

## 📚 Resources

- **Full Instructions**: `GEMINI_DEVELOPMENT_PROMPT.md`
- **Quick Reference**: `QUICK_START_GUIDE.md`
- **Verification**: `PROJECT_VERIFICATION_REPORT.md`
- **Expo Docs**: https://docs.expo.dev/
- **Firebase Docs**: https://firebase.google.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Gemini Docs**: https://ai.google.dev/docs

---

## ⏱️ Timeline

**Week 1**: Phases 1-2 (Auth + Database)  
**Week 2**: Phases 3-4 (AI + Videos)  
**Week 3**: Phases 5-7 (Camera + PDFs + Polish)

**Total**: 2-3 weeks for complete rebuild

---

## 🚀 Ready to Start?

1. Open `GEMINI_DEVELOPMENT_PROMPT.md`
2. Follow Phase 1 instructions
3. Build something amazing!

**Good luck! 🎉**
