# Smart Learner Application - Analysis Summary

## Application Purpose
Smart Learner is a **personal AI tutor mobile application** for South African students (Grades 1-12) that provides:
- AI-powered homework assistance with chat interface
- Educational video library with YouTube integration
- AI-generated quizzes
- Past exam paper repository
- OCR-based homework scanning

## Current Tech Stack (Original App)

### Backend & Data
- **Supabase** - Authentication, database, and file storage
- **OpenAI GPT-3.5-turbo & GPT-4** - AI tutor responses and quiz generation

### Frontend & Mobile
- **React Native** with **Expo SDK ~52**
- **Expo Router v4** - File-based routing
- **NativeWind v2** - Tailwind CSS styling
- **TypeScript** - Type safety

### APIs & Services
- **Google Cloud Vision API** - OCR for homework scanning ✅ Keep
- **YouTube Data API v3** - Video search and metadata ✅ Keep
- **React Native Vision Camera v4** - Camera functionality ✅ Keep
- **Supabase Storage** - PDF file hosting ❌ Replace with ImageKit

## New Tech Stack (Rebuild Requirements)

### Backend & Data
- **Firebase Authentication** - Replace Supabase Auth
  - Email/password
  - Google OAuth
- **Neon PostgreSQL** - Replace Supabase Database
  - Serverless PostgreSQL
  - HTTP-based queries
- **ImageKit.io** - Replace Supabase Storage
  - PDF hosting for past papers

### AI & ML
- **Google Gemini 1.5 Pro** - Replace OpenAI
  - AI tutor chat responses
  - Quiz question generation
  - Context-aware educational content

### Keep Unchanged
- React Native + Expo SDK 54
- Expo Router v4
- NativeWind v2
- TypeScript
- Google Cloud Vision API
- YouTube Data API v3
- React Native Vision Camera v4

## Database Schema

### Tables Overview

**1. users**
- Stores user account information
- Fields: id, email, username, role, timestamps

**2. onboarding**
- Tracks user's educational level
- Fields: user_id, school_level (1=Primary, 2=Secondary), grade_range (1-5)

**3. subjects**
- Available subjects per grade/school
- Fields: subject_id, subject_name, school_level, grade_range

**4. subject_videos**
- YouTube video links per subject
- Fields: id, subject_id, title, description, video_url

## Application Structure

### File-Based Routing (Expo Router)

```
app/
├── _layout.tsx                    # Root layout with providers
├── index.tsx                       # Entry point / splash
├── (auth)/                         # Authentication group
│   ├── SignIn.tsx                  # Login screen
│   └── SignUp.tsx                  # Registration screen
├── (onboarding)/                   # Onboarding flow
│   ├── School.tsx                  # Select school level
│   └── Grade.tsx                   # Select grade range
└── (dashboard)/                    # Main app
    ├── (home)/
    │   ├── Home.tsx                # Subject selection dashboard
    │   └── Profile.tsx             # User profile & settings
    └── subject/[id]/
        ├── Options.tsx             # Feature selection
        ├── (course)/
        │   ├── VideoList.tsx       # YouTube video library
        │   └── VideoPlayer.tsx     # Video playback
        ├── (homework)/
        │   ├── Homework.tsx        # AI tutor chat
        │   ├── Camera.tsx          # Homework scanning
        │   └── OCRConfirm.tsx      # Review OCR text
        ├── (quiz)/
        │   ├── SelectTopic.tsx     # Choose quiz topic
        │   ├── StartQuiz.tsx       # Quiz instructions
        │   ├── Questions.tsx       # Quiz interface
        │   └── Score.tsx           # Quiz results
        └── (pastpapers)/
            ├── GradeCheck.tsx      # Verify grade
            ├── SelectYear.tsx      # Choose exam year
            ├── ListPapers.tsx      # List PDFs
            └── PdfViewer.tsx       # View PDF
```

## Key Features Breakdown

### 1. Authentication
- **Sign Up**: Email/password + Google OAuth → Create user in database → Onboarding
- **Sign In**: Email/password + Google OAuth → Fetch onboarding data → Navigate to Home
- Session persistence with AsyncStorage

### 2. Onboarding
- **Step 1**: Select school level (Primary/Secondary)
- **Step 2**: Select grade range (1-3, 4-6, 7, 8-9, 10-12)
- Save to database → Navigate to dashboard

### 3. Dashboard (Home)
- Fetch subjects matching user's grade and school level from database
- Display as interactive cards
- Navigate to subject options

### 4. Course/Videos
- Display curated videos from database
- YouTube search integration
- Fetch thumbnails via YouTube API
- Play videos in embedded player

### 5. Homework/AI Tutor
- **Chat Interface**: User questions + AI responses
- **Camera Scanning**: Capture homework → OCR with Google Vision → Add to chat
- **AI Integration**: 
  - System prompt tailored to grade level and subject
  - Context-aware responses using Gemini API
  - Markdown rendering for formatted answers

### 6. Quiz
- **Topic Selection**: Choose from predefined topics
- **AI Generation**: Gemini generates 4 multiple-choice questions
- **Interactive Quiz**: 
  - Progress bar
  - Instant feedback (green/red highlighting)
  - Score tracking (10 points per correct answer)
- **Results**: Display final score with option to retry

### 7. Past Papers
- **Year Selection**: Choose exam year
- **PDF Library**: Fetch PDFs from ImageKit organized by grade/subject/year
- **PDF Viewer**: Display exam papers with zoom and navigation

## Context Providers

### 1. AuthProvider
- Firebase session state
- User authentication status
- Username management
- Auto-refresh tokens

### 2. OnboardingProvider
- School level and grade range
- Active subject tracking
- Subject list management

### 3. MessageProvider
- Chat message history
- Send/receive message handling
- Loading states

### 4. FileProvider
- File upload management
- OCR content storage
- File metadata

## API Integrations

### Current → New Mapping

| Feature | Current API | New API | Change Type |
|---------|-------------|---------|-------------|
| Auth (Email/Pass) | Supabase Auth | Firebase Auth | Replace |
| Auth (Google OAuth) | Supabase Auth | Firebase Auth | Replace |
| Database Queries | Supabase PostgreSQL | Neon PostgreSQL | Replace |
| File Storage | Supabase Storage | ImageKit | Replace |
| AI Chat | OpenAI GPT-4 | Gemini 1.5 Pro | Replace |
| Quiz Generation | OpenAI GPT-3.5 | Gemini 1.5 Pro | Replace |
| OCR | Google Vision API | Google Vision API | Keep |
| Video Search | YouTube API v3 | YouTube API v3 | Keep |
| Camera | Vision Camera v4 | Vision Camera v4 | Keep |

## Migration Strategy

### Critical Changes

1. **Authentication Flow**
   - Replace `supabase.auth.*` calls with Firebase Auth equivalents
   - Update OAuth redirect URLs and schemes
   - Maintain session persistence logic

2. **Database Queries**
   - Replace `supabase.from().select()` with Neon HTTP queries
   - Maintain same table structure and relationships
   - Update all CRUD operations

3. **AI Prompts**
   - Convert OpenAI chat completion format to Gemini format
   - Adjust system prompts for Gemini's API structure
   - Maintain same educational context and tone

4. **File Storage**
   - Replace Supabase Storage paths with ImageKit URLs
   - Update PDF fetching logic
   - Maintain folder structure: `{grade}/{subject}/{year}/`

## Testing Requirements

### Test Coverage Per Phase
- **Unit Tests**: Utility functions, helpers
- **Integration Tests**: API calls (Firebase, Neon, Gemini, YouTube, Vision)
- **Component Tests**: All reusable components
- **Screen Tests**: Navigation flows, user interactions

### Build Testing
- **Development Build**: After each phase
- **Preview Build**: Before final testing
- **Production Build**: After all tests pass

### Test Checklist Before Each Build
✅ All tests passing  
✅ No TypeScript errors  
✅ No linting errors  
✅ Environment variables set  
✅ Camera tested on device  
✅ All API integrations verified  
✅ Offline/error handling tested  

## Environment Variables

```env
# Firebase Authentication
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Neon PostgreSQL Database
EXPO_PUBLIC_NEON_DATABASE_URL=

# Google Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=

# Google Cloud Vision OCR (Keep)
EXPO_PUBLIC_CLOUD_VISION_API_KEY=

# YouTube API (Keep)
EXPO_PUBLIC_YOUTUBE_API_KEY=

# ImageKit File Storage
EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT=
EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY=
```

## UI/UX Guidelines

### Target Audience
- Primary school students (ages 6-13)
- Secondary school students (ages 14-18)
- South African curriculum

### Design Principles
- **Modern & Playful**: Rounded corners, soft shadows, gradients
- **Age-Appropriate**: Engaging but not childish
- **Clear Hierarchy**: Large headings, clear CTAs
- **Touch-Friendly**: Minimum 44x44 tap targets
- **Consistent**: Unified design system throughout

### Color Palette
- **Primary**: Blue/Purple (#5470FD, #afbcff)
- **Background**: Light gray (#cbd5e1, #f8f9fa)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Text**: Dark gray (#1f2937, #4b5563)

## Development Timeline

### Phase 1: Setup & Auth (Week 1)
- Project setup with Expo SDK 54
- Firebase Authentication
- Neon PostgreSQL setup
- Sign In/Sign Up screens
- Tests + Development build

### Phase 2: Onboarding & Dashboard (Week 1-2)
- Onboarding flow
- Home dashboard
- Profile screen
- Database integration
- Tests + Development build

### Phase 3: Course/Videos (Week 2)
- Video list with YouTube integration
- Video player
- Tests + Development build

### Phase 4: Homework/AI Tutor (Week 3)
- Gemini API integration
- Chat interface
- Tests + Development build

### Phase 5: Camera & OCR (Week 3)
- Camera screen
- OCR integration
- Tests + Device build (camera requires real device)

### Phase 6: Quiz Feature (Week 4)
- Quiz flow
- Gemini quiz generation
- Tests + Development build

### Phase 7: Past Papers (Week 4)
- ImageKit integration
- PDF viewer
- Tests + Development build

### Phase 8: Polish & Production (Week 5)
- UI/UX refinements
- Performance optimization
- Full test suite
- Preview build
- Production build

## Success Criteria

✅ All 40+ screens functional  
✅ Firebase auth working (email + Google OAuth)  
✅ Neon database CRUD operations working  
✅ Gemini AI generating appropriate responses  
✅ Google Vision OCR extracting text  
✅ YouTube videos playing correctly  
✅ ImageKit PDFs loading  
✅ Camera scanning homework on device  
✅ All tests passing (>80% coverage)  
✅ Development/preview/production builds successful  
✅ No crashes or errors  
✅ Modern, unified UI design  

## Key Differences from Original

| Aspect | Original | New |
|--------|----------|-----|
| Auth Provider | Supabase | Firebase |
| Database | Supabase PostgreSQL | Neon PostgreSQL |
| AI Model | OpenAI GPT | Google Gemini |
| File Storage | Supabase Storage | ImageKit |
| OCR | Google Vision ✓ | Google Vision ✓ |
| Video API | YouTube ✓ | YouTube ✓ |
| Camera | Vision Camera ✓ | Vision Camera ✓ |
| Framework | Expo SDK 52 | Expo SDK 54 |

## Notes for Gemini

- This is a **complete rebuild**, not a migration
- Maintain the same user experience and functionality
- Replace specific services but keep the app's educational purpose
- Test incrementally at every phase
- Create builds frequently to catch errors early
- Focus on stability and reliability
- Ensure all error cases are handled gracefully
- Make the UI modern and age-appropriate

---

**Generated**: November 25, 2025  
**Purpose**: Specification document for rebuilding Smart Learner with new tech stack  
**Target AI**: Google Gemini (for development assistance)
