# Smart Learner Application - Complete Rebuild Instructions for Gemini AI

## 🎯 Project Overview

You are tasked with rebuilding the **Smart Learner** application - a personal AI tutor mobile app for South African students (Grades 1-12). This is a **React Native Expo** application that provides AI-powered homework assistance, educational videos, quizzes, and past exam papers.

**CRITICAL**: This project has already been initialized with Expo SDK 54. The SignIn and SignUp screens have been created but need to be tested and potentially refactored to use the new tech stack.

---

## 📋 Tech Stack Migration

### ❌ REPLACE (Old → New)

| Component | Old | New | Action |
|-----------|-----|-----|--------|
| **Authentication** | Supabase Auth | **Firebase Authentication** | Complete replacement |
| **Database** | Supabase PostgreSQL | **Neon PostgreSQL** (Serverless) | Complete replacement |
| **AI Model** | OpenAI GPT-4/GPT-3.5 | **Google Gemini 1.5 Pro** | Complete replacement |
| **File Storage** | Supabase Storage | **ImageKit.io** | Complete replacement |

### ✅ KEEP (No Changes Required)

- **React Native** with **Expo SDK 54**
- **Expo Router v4** (File-based routing)
- **NativeWind v2** (Tailwind CSS)
- **TypeScript** (Type safety)
- **React Native Vision Camera v4** (Camera functionality)
- **Google Cloud Vision API** (OCR for homework scanning)
- **YouTube Data API v3** (Video search and metadata)
- **React Native Reanimated** (Animations)
- **React Native PDF** (PDF viewing)
- **React Native YouTube iframe** (Video playback)
- **React Native Markdown Display** (Chat rendering)

---

## 🏗️ Project Structure (Expo Router File-Based Routing)

```
app/
├── _layout.tsx                    # Root layout with providers
├── index.tsx                       # Entry point / splash screen
├── +not-found.tsx                  # 404 error screen
│
├── (auth)/                         # Authentication group
│   ├── _layout.tsx
│   ├── SignIn.tsx                  # ✅ Already created - needs Firebase migration
│   └── SignUp.tsx                  # ✅ Already created - needs Firebase migration
│
├── (onboarding)/                   # Onboarding flow
│   ├── _layout.tsx
│   ├── School.tsx                  # Select school level (Primary/Secondary)
│   └── Grade.tsx                   # Select grade range
│
└── (dashboard)/                    # Main authenticated app
    ├── _layout.tsx
    │
    ├── (home)/                     # Home tab group
    │   ├── _layout.tsx
    │   ├── Home.tsx                # Subject selection dashboard
    │   └── Profile.tsx             # User profile & settings
    │
    └── subject/[id]/               # Dynamic subject routes
        ├── Options.tsx             # Feature selection (Videos/Homework/Quiz/Papers)
        │
        ├── (course)/               # Video library group
        │   ├── _layout.tsx
        │   ├── VideoList.tsx       # List curated + YouTube videos
        │   └── VideoPlayer.tsx     # Play videos
        │
        ├── (homework)/             # AI Tutor group
        │   ├── _layout.tsx
        │   ├── Homework.tsx        # Chat interface with AI
        │   ├── Camera.tsx          # Scan homework
        │   └── OCRConfirm.tsx      # Review OCR extracted text
        │
        ├── (quiz)/                 # Quiz group
        │   ├── _layout.tsx
        │   ├── SelectTopic.tsx     # Choose quiz topic
        │   ├── StartQuiz.tsx       # Quiz instructions
        │   ├── Questions.tsx       # Interactive quiz
        │   └── Score.tsx           # Quiz results
        │
        └── (pastpapers)/           # Past papers group
            ├── _layout.tsx
            ├── GradeCheck.tsx      # Verify grade
            ├── SelectYear.tsx      # Choose exam year
            ├── ListPapers.tsx      # List available PDFs
            └── PdfViewer.tsx       # View PDF with zoom
```

---

## 📦 Dependencies Analysis

### Current Dependencies (from package.json)

**✅ KEEP THESE PACKAGES** - They are compatible with Expo SDK 54:

```json
{
  "@expo/vector-icons": "^14.0.2",
  "@react-native-async-storage/async-storage": "1.23.1",
  "@react-native-picker/picker": "2.9.0",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "@react-navigation/native": "^7.0.14",
  "@react-navigation/native-stack": "^7.2.0",
  "expo": "~52.0.26",
  "expo-router": "~4.0.17",
  "expo-auth-session": "~6.0.3",
  "expo-blur": "~14.0.2",
  "expo-constants": "~17.0.4",
  "expo-dev-client": "~5.0.10",
  "expo-document-picker": "~13.0.2",
  "expo-file-system": "~18.0.7",
  "expo-font": "~13.0.3",
  "expo-haptics": "~14.0.1",
  "expo-linking": "~7.0.4",
  "expo-media-library": "~17.0.5",
  "expo-splash-screen": "~0.29.21",
  "expo-status-bar": "~2.0.1",
  "expo-symbols": "~0.2.1",
  "expo-system-ui": "~4.0.7",
  "expo-web-browser": "~14.0.2",
  "nativewind": "^2.0.11",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "react-native-gesture-handler": "~2.20.2",
  "react-native-markdown-display": "^7.0.2",
  "react-native-pdf": "^6.7.6",
  "react-native-reanimated": "~3.16.1",
  "react-native-safe-area-context": "4.12.0",
  "react-native-screens": "~4.4.0",
  "react-native-vision-camera": "^4.6.3",
  "react-native-webview": "^13.12.5",
  "react-native-youtube-iframe": "^2.3.0",
  "react-native-blob-util": "^0.21.2",
  "@config-plugins/react-native-pdf": "^9.0.0",
  "@config-plugins/react-native-blob-util": "^9.0.0",
  "date-fns": "^4.1.0"
}
```

**❌ REMOVE THESE PACKAGES**:

```json
{
  "@supabase/supabase-js": "^2.47.16",
  "openai": "^4.79.1"
}
```

**➕ ADD THESE NEW PACKAGES**:

```bash
# Firebase Authentication
npx expo install firebase

# Neon PostgreSQL (serverless database via HTTP)
npm install @neondatabase/serverless

# Google Gemini AI
npm install @google/generative-ai

# ImageKit SDK for React Native
npm install imagekitio-react-native
```

---

## 🔑 Environment Variables

Create/update `.env` file with:

```env
# Firebase Authentication
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Neon PostgreSQL Database
EXPO_PUBLIC_NEON_DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Google Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Google Cloud Vision OCR (KEEP)
EXPO_PUBLIC_CLOUD_VISION_API_KEY=your_cloud_vision_api_key

# YouTube API (KEEP)
EXPO_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

# ImageKit File Storage
EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
EXPO_PUBLIC_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

---

## 🗄️ Database Schema (Neon PostgreSQL)

Maintain the **exact same schema** as the original Supabase database:

### Table: `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `onboarding`

```sql
CREATE TABLE onboarding (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_level INTEGER NOT NULL, -- 1=Primary, 2=Secondary
    grade_range INTEGER NOT NULL, -- 1=Grades 1-3, 2=Grades 4-6, 3=Grade 7, 4=Grades 8-9, 5=Grades 10-12
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### Table: `subjects`

```sql
CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    school_level INTEGER NOT NULL, -- 1=Primary, 2=Secondary
    grade_range INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `subject_videos`

```sql
CREATE TABLE subject_videos (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(subject_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL, -- YouTube video ID or URL
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 UI/UX Design Guidelines

### Design Principles
- **Modern Minimalist**: Clean, uncluttered interfaces
- **Age-Appropriate**: Professional yet engaging for students aged 6-18
- **Consistent Design System**: Unified typography, spacing, colors
- **Touch-Friendly**: Minimum 44x44pt tap targets
- **Accessibility**: High contrast, readable fonts, clear hierarchy

### Color Palette (Tailwind/NativeWind)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        smartLearner: {
          darkBlue: '#012866',
          orange: '#ff7700',
          darkGray: '#161717',
          lightGray: '#d9dbdb',
        },
        primary: {
          DEFAULT: '#5470FD',
          light: '#afbcff',
          dark: '#3b52cc',
        },
        background: {
          light: '#f8f9fa',
          medium: '#cbd5e1',
        },
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
      }
    }
  }
}
```

### Typography
- **Headings**: Bold, clear hierarchy (text-2xl, text-3xl, text-4xl)
- **Body**: Medium weight, comfortable reading size (text-base, text-lg)
- **Buttons**: Rounded corners (rounded-full, rounded-2xl)
- **Cards**: Soft shadows (shadow-md, shadow-lg)

---

## 🔄 Migration Instructions

### Phase 1: Setup & Firebase Authentication (Priority 1)

**Goal**: Replace Supabase Auth with Firebase Auth, migrate existing SignIn/SignUp screens

#### Step 1.1: Install Firebase
```bash
npx expo install firebase
```

#### Step 1.2: Create Firebase Config
**File**: `lib/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
```

#### Step 1.3: Update AuthProvider
**File**: `context/AuthProvider.tsx`

Replace Supabase with Firebase:

```typescript
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '@/lib/firebase';
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  signOut as firebaseSignOut 
} from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  username: string | null;
  setUsername: (name: string) => void;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  username: null,
  setUsername: () => {},
  loading: true,
  signOut: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUsername(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, username, setUsername, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Step 1.4: Update SignIn Screen
**File**: `app/(auth)/SignIn.tsx`

Replace Supabase auth calls with Firebase:

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { neon } from '@neondatabase/serverless';

// Email/Password Sign In
const signInWithEmail = async () => {
  try {
    setIsLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      form.email, 
      form.password
    );
    
    // Fetch username from Neon database
    const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL!);
    const result = await sql`
      SELECT username FROM users 
      WHERE email = ${form.email.toLowerCase().trim()}
    `;
    
    if (result[0]) {
      setUsername(result[0].username);
    }
    
    router.replace('/Home');
  } catch (error: any) {
    Alert.alert('Error', error.message);
  } finally {
    setIsLoading(false);
  }
};

// Google OAuth Sign In
const performOAuth = async () => {
  // Use expo-auth-session for Google OAuth
  // Then use signInWithCredential with Firebase
  // Implementation details depend on expo-auth-session setup
};
```

#### Step 1.5: Update SignUp Screen
**File**: `app/(auth)/SignUp.tsx`

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { neon } from '@neondatabase/serverless';

const onSignUpWithEmail = async () => {
  try {
    setIsLoading(true);
    
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );
    
    // Insert user into Neon database
    const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL!);
    await sql`
      INSERT INTO users (id, email, username, role)
      VALUES (${userCredential.user.uid}, ${userCredential.user.email}, ${form.name}, 'Student')
    `;
    
    setUsername(form.name);
    router.push('/(onboarding)/School');
  } catch (error: any) {
    Alert.alert('Error', error.message);
  } finally {
    setIsLoading(false);
  }
};
```

#### ✅ Testing Phase 1
Create test file: `__tests__/auth.test.ts`

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '@/app/(auth)/SignIn';
import SignUp from '@/app/(auth)/SignUp';

describe('Authentication', () => {
  test('SignIn screen renders correctly', () => {
    const { getByPlaceholder } = render(<SignIn />);
    expect(getByPlaceholder('Email')).toBeTruthy();
    expect(getByPlaceholder('Password')).toBeTruthy();
  });
  
  test('SignUp screen renders correctly', () => {
    const { getByPlaceholder } = render(<SignUp />);
    expect(getByPlaceholder('Username')).toBeTruthy();
    expect(getByPlaceholder('Email')).toBeTruthy();
    expect(getByPlaceholder('Password')).toBeTruthy();
  });
  
  // Add more tests for Firebase integration
});
```

**Build Command**: 
```bash
npx expo start --dev-client
# Or for EAS build:
eas build --profile development --platform android
```

---

### Phase 2: Onboarding & Database Integration (Priority 2)

**Goal**: Create onboarding flow, connect to Neon PostgreSQL

#### Step 2.1: Install Neon
```bash
npm install @neondatabase/serverless
```

#### Step 2.2: Create Neon Helper
**File**: `lib/neon.ts`

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL!);

export const db = {
  // Users
  async getUserById(userId: string) {
    return await sql`SELECT * FROM users WHERE id = ${userId}`;
  },
  
  async updateUser(userId: string, data: { username?: string }) {
    return await sql`
      UPDATE users 
      SET username = ${data.username}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `;
  },
  
  // Onboarding
  async saveOnboarding(userId: string, schoolLevel: number, gradeRange: number) {
    return await sql`
      INSERT INTO onboarding (user_id, school_level, grade_range)
      VALUES (${userId}, ${schoolLevel}, ${gradeRange})
      ON CONFLICT (user_id) 
      DO UPDATE SET school_level = ${schoolLevel}, grade_range = ${gradeRange}
      RETURNING *
    `;
  },
  
  async getOnboarding(userId: string) {
    return await sql`
      SELECT * FROM onboarding WHERE user_id = ${userId}
    `;
  },
  
  // Subjects
  async getSubjects(schoolLevel: number, gradeRange: number) {
    return await sql`
      SELECT * FROM subjects 
      WHERE school_level = ${schoolLevel} 
      AND grade_range = ${gradeRange}
      ORDER BY subject_name ASC
    `;
  },
  
  // Videos
  async getSubjectVideos(subjectId: number) {
    return await sql`
      SELECT * FROM subject_videos 
      WHERE subject_id = ${subjectId}
      ORDER BY created_at DESC
    `;
  },
};

export default sql;
```

#### Step 2.3: Update OnboardingProvider
**File**: `context/OnboardingProvider.tsx`

```typescript
import { db } from '@/lib/neon';
import { useAuthContext } from './AuthProvider';

// Replace all Supabase queries with db helper functions
const saveOnboardingData = async (schoolLevel: number, gradeRange: number) => {
  if (!user?.uid) return;
  
  try {
    await db.saveOnboarding(user.uid, schoolLevel, gradeRange);
  } catch (error) {
    console.error('Error saving onboarding:', error);
    throw error;
  }
};
```

#### Step 2.4: Create Onboarding Screens

**File**: `app/(onboarding)/School.tsx`

```typescript
import { View, Text, TouchableOpacity } from 'react-native';
import { useOnboarding } from '@/context/OnboardingProvider';
import { router } from 'expo-router';

const schoolLevels = [
  { label: 'Primary School', value: 1 },
  { label: 'Secondary School', value: 2 },
];

export default function School() {
  const { setSchoolLevel } = useOnboarding();
  
  const handleSelection = (level: number) => {
    setSchoolLevel(level);
    router.push('/(onboarding)/Grade');
  };
  
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-center mb-8">
        Select Your School Level
      </Text>
      
      {schoolLevels.map((level) => (
        <TouchableOpacity
          key={level.value}
          onPress={() => handleSelection(level.value)}
          className="bg-primary p-6 rounded-2xl mb-4 shadow-md"
        >
          <Text className="text-white text-xl font-semibold text-center">
            {level.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

**File**: `app/(onboarding)/Grade.tsx`

```typescript
import { View, Text, TouchableOpacity } from 'react-native';
import { useOnboarding } from '@/context/OnboardingProvider';
import { useAuthContext } from '@/context/AuthProvider';
import { router } from 'expo-router';

const gradeRanges = [
  { label: 'Grade 1 - 3', value: 1 },
  { label: 'Grade 4 - 6', value: 2 },
  { label: 'Grade 7', value: 3 },
  { label: 'Grade 8 - 9', value: 4 },
  { label: 'Grade 10 - 12', value: 5 },
];

export default function Grade() {
  const { schoolLevel, setGradeRange } = useOnboarding();
  const { user } = useAuthContext();
  const { db } = require('@/lib/neon');
  
  const handleSelection = async (range: number) => {
    try {
      setGradeRange(range);
      
      // Save to Neon database
      if (user?.uid) {
        await db.saveOnboarding(user.uid, schoolLevel, range);
      }
      
      router.replace('/Home');
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };
  
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-center mb-8">
        Select Your Grade
      </Text>
      
      {gradeRanges.map((grade) => (
        <TouchableOpacity
          key={grade.value}
          onPress={() => handleSelection(grade.value)}
          className="bg-primary-light p-6 rounded-2xl mb-4 shadow-md"
        >
          <Text className="text-smartLearner-darkBlue text-xl font-semibold text-center">
            {grade.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

#### Step 2.5: Create Home Dashboard

**File**: `app/(dashboard)/(home)/Home.tsx`

```typescript
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useOnboarding } from '@/context/OnboardingProvider';
import { useEffect, useState } from 'react';
import { db } from '@/lib/neon';
import { router } from 'expo-router';

interface Subject {
  subject_id: number;
  subject_name: string;
}

export default function Home() {
  const { schoolLevel, gradeRange } = useOnboarding();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadSubjects();
  }, [schoolLevel, gradeRange]);
  
  const loadSubjects = async () => {
    try {
      const result = await db.getSubjects(schoolLevel, gradeRange);
      setSubjects(result);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const navigateToSubject = (subjectId: number, subjectName: string) => {
    router.push(`/subject/${subjectId}/Options?name=${subjectName}`);
  };
  
  return (
    <View className="flex-1 bg-background-light p-4">
      <Text className="text-3xl font-bold mb-6 text-smartLearner-darkBlue">
        Choose a Subject
      </Text>
      
      <FlatList
        data={subjects}
        numColumns={2}
        keyExtractor={(item) => item.subject_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigateToSubject(item.subject_id, item.subject_name)}
            className="flex-1 m-2 bg-white rounded-2xl p-6 shadow-lg"
          >
            <Text className="text-xl font-semibold text-center text-smartLearner-darkBlue">
              {item.subject_name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
```

#### ✅ Testing Phase 2
```typescript
// __tests__/onboarding.test.ts
describe('Onboarding Flow', () => {
  test('School selection screen renders', () => {
    // Test implementation
  });
  
  test('Grade selection screen renders', () => {
    // Test implementation
  });
  
  test('Data is saved to Neon database', async () => {
    // Test database integration
  });
});

// __tests__/database.test.ts
describe('Neon Database Integration', () => {
  test('Fetches subjects correctly', async () => {
    const subjects = await db.getSubjects(1, 1);
    expect(subjects).toBeDefined();
  });
});
```

**Build Command**: 
```bash
npx expo start --dev-client
```

---

### Phase 3: Google Gemini AI Integration (Priority 3)

**Goal**: Replace OpenAI with Google Gemini for chat and quiz generation

#### Step 3.1: Install Gemini SDK
```bash
npm install @google/generative-ai
```

#### Step 3.2: Create Gemini Helper
**File**: `lib/gemini.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

export const gemini = {
  // Chat completion (for homework help)
  async chat(messages: { role: string; content: string }[], systemPrompt: string) {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      systemInstruction: systemPrompt,
    });
    
    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    
    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    
    return response.text();
  },
  
  // Generate quiz questions
  async generateQuiz(subject: string, topic: string, gradeLevel: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      You are an educational quiz generator for South African students.
      
      Generate exactly 4 multiple-choice questions for:
      - Subject: ${subject}
      - Topic: ${topic}
      - Grade Level: ${gradeLevel}
      
      Return ONLY a valid JSON array with this exact structure:
      [
        {
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0
        }
      ]
      
      Rules:
      - Questions must align with the South African CAPS curriculum
      - Difficulty appropriate for ${gradeLevel}
      - correctAnswer is the index (0-3) of the correct option
      - Return ONLY the JSON array, no markdown formatting, no additional text
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (remove markdown if present)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  },
};
```

#### Step 3.3: Update Chat Component
**File**: `components/ChatInputSection.tsx`

Replace OpenAI with Gemini:

```typescript
import { gemini } from '@/lib/gemini';
import { useOnboarding } from '@/context/OnboardingProvider';

const sendMessage = async () => {
  const userMessage: Message = { 
    id: Date.now().toString(), 
    type: 'text', 
    content: inputTextValue, 
    sender: 'user' 
  };
  setMessages((prev) => [...prev, userMessage]);
  setInputTextValue('');
  
  try {
    const systemPrompt = `
      You are an AI tutor designed to assist South African students in 
      ${primaryGradeLevels.find((grade) => grade.value === gradeRange)?.label} 
      with their homework.
      
      Your goal is to provide clear and concise explanations, examples, and 
      guidance in relation to ${activeSubject} as a subject the current student 
      is enrolled in.
      
      Please ensure that your responses are tailored to the South African 
      curriculum (CAPS) and educational standards.
      
      Format your responses using markdown for better readability:
      - Use **bold** for emphasis
      - Use bullet points for lists
      - Use code blocks for formulas or examples
    `;
    
    // Prepare messages for Gemini
    const formattedMessages = [
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: inputTextValue },
    ];
    
    const response = await gemini.chat(formattedMessages, systemPrompt);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: response || 'Sorry, I did not understand that...',
      sender: 'system',
    };
    
    setMessages((prev) => [...prev, aiMessage]);
  } catch (error: any) {
    console.error('Failed to send message to Gemini:', error);
    const errorMessage: Message = { 
      id: Date.now().toString(), 
      type: 'text', 
      content: "Sorry, I'm having trouble connecting. Please try again.", 
      sender: 'system'
    };
    setMessages((prev) => [...prev, errorMessage]);
  }
};
```

#### Step 3.4: Update Quiz Generation
**File**: `app/(dashboard)/subject/[id]/(quiz)/Questions.tsx`

```typescript
import { gemini } from '@/lib/gemini';
import { useOnboarding } from '@/context/OnboardingProvider';

const generateQuestions = async () => {
  try {
    setIsLoading(true);
    
    const gradeLabel = primaryGradeLevels.find(
      grade => grade.value === gradeRange
    )?.label || 'Primary School';
    
    const questions = await gemini.generateQuiz(
      activeSubject,
      selectedTopic,
      gradeLabel
    );
    
    if (!Array.isArray(questions) || questions.length !== 4) {
      throw new Error('Invalid quiz format');
    }
    
    // Validate each question
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || 
          q.options.length !== 4 || typeof q.correctAnswer !== 'number') {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });
    
    setQuestions(questions);
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    Alert.alert('Error', 'Failed to generate quiz. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

#### ✅ Testing Phase 3
```typescript
// __tests__/gemini.test.ts
import { gemini } from '@/lib/gemini';

describe('Gemini AI Integration', () => {
  test('Chat returns valid response', async () => {
    const messages = [
      { role: 'user', content: 'What is 2+2?' }
    ];
    const response = await gemini.chat(messages, 'You are a math tutor');
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
  });
  
  test('Quiz generation returns valid format', async () => {
    const quiz = await gemini.generateQuiz('Mathematics', 'Addition', 'Grade 1-3');
    expect(Array.isArray(quiz)).toBe(true);
    expect(quiz).toHaveLength(4);
    
    quiz.forEach(q => {
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('correctAnswer');
      expect(q.options).toHaveLength(4);
    });
  });
});
```

---

### Phase 4: Video Library with YouTube API (Priority 4)

**Goal**: Display curated videos + YouTube search integration

#### Step 4.1: Create Video List Screen
**File**: `app/(dashboard)/subject/[id]/(course)/VideoList.tsx`

```typescript
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '@/lib/neon';
import { router, useLocalSearchParams } from 'expo-router';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
}

export default function VideoList() {
  const { id } = useLocalSearchParams(); // subject ID
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadVideos();
  }, []);
  
  const loadVideos = async () => {
    try {
      // Fetch curated videos from Neon
      const curatedVideos = await db.getSubjectVideos(Number(id));
      
      // Optional: Fetch additional YouTube videos
      const youtubeVideos = await searchYouTube();
      
      setVideos([...curatedVideos, ...youtubeVideos]);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const searchYouTube = async () => {
    // Keep existing YouTube API integration
    const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
    // ... existing YouTube search logic
    return [];
  };
  
  const openVideo = (videoId: string) => {
    router.push(`/subject/${id}/(course)/VideoPlayer?videoId=${videoId}`);
  };
  
  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openVideo(item.video_url)}
            className="mb-4 bg-background-light rounded-xl overflow-hidden shadow-md"
          >
            <Image
              source={{ uri: item.thumbnail_url }}
              className="w-full h-48"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-lg font-semibold text-smartLearner-darkBlue">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 mt-2" numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
```

**Note**: Keep existing YouTube API integration and react-native-youtube-iframe usage.

---

### Phase 5: Camera & OCR Integration (Priority 5)

**Goal**: Keep Vision Camera and Google Cloud Vision API for homework scanning

#### Step 5.1: Camera Screen (Keep Existing Implementation)
**File**: `app/(dashboard)/subject/[id]/(homework)/Camera.tsx`

**Action**: No changes needed - keep existing Vision Camera v4 implementation

#### Step 5.2: OCR Confirmation (Keep Existing)
**File**: `app/(dashboard)/subject/[id]/(homework)/OCRConfirm.tsx`

**Action**: No changes needed - keep existing Google Cloud Vision API integration

#### ✅ Testing Phase 5
**Important**: Camera must be tested on a physical device or iOS simulator (not Android emulator)

```bash
# Build for device testing
eas build --profile development --platform android
# or
eas build --profile development --platform ios
```

---

### Phase 6: ImageKit Integration for Past Papers (Priority 6)

**Goal**: Replace Supabase Storage with ImageKit for PDF hosting

#### Step 6.1: Install ImageKit
```bash
npm install imagekitio-react-native
```

#### Step 6.2: Create ImageKit Helper
**File**: `lib/imagekit.ts`

```typescript
import ImageKit from 'imagekitio-react-native';

const imagekit = new ImageKit({
  urlEndpoint: process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
});

export const getImageKitUrl = (path: string) => {
  return imagekit.url({
    path: path,
    transformation: [{
      quality: '90',
    }],
  });
};

export const listPastPapers = async (grade: number, subject: string, year: number) => {
  // List files from ImageKit folder structure: /past-papers/{grade}/{subject}/{year}/
  const folderPath = `/past-papers/${grade}/${subject}/${year}/`;
  
  // Note: ImageKit listing requires server-side implementation
  // For client-side, you may need to maintain a database index of files
  
  return [];
};

export default imagekit;
```

#### Step 6.3: PDF Viewer Screen
**File**: `app/(dashboard)/subject/[id]/(pastpapers)/PdfViewer.tsx`

```typescript
import { View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useLocalSearchParams } from 'expo-router';
import { getImageKitUrl } from '@/lib/imagekit';

export default function PdfViewer() {
  const { pdfPath } = useLocalSearchParams();
  
  const pdfUrl = getImageKitUrl(pdfPath as string);
  
  return (
    <View className="flex-1">
      <Pdf
        source={{ uri: pdfUrl }}
        style={{ flex: 1 }}
        onLoadComplete={(numberOfPages) => {
          console.log(`PDF loaded with ${numberOfPages} pages`);
        }}
        onError={(error) => {
          console.error('PDF Error:', error);
        }}
      />
    </View>
  );
}
```

---

## 🧪 Testing Strategy

### Test Every Feature Incrementally

For each phase, create tests in `__tests__/` folder:

```typescript
// Example: __tests__/auth.test.ts
import { render, fireEvent, waitFor } from '@testing-library/react-native';

describe('Authentication', () => {
  test('SignIn with email', async () => {
    // Test implementation
  });
  
  test('Google OAuth flow', async () => {
    // Test implementation
  });
});

// Example: __tests__/gemini.test.ts
describe('Gemini AI', () => {
  test('Chat response', async () => {
    // Test Gemini chat
  });
  
  test('Quiz generation', async () => {
    // Test quiz generation
  });
});

// Example: __tests__/database.test.ts
describe('Neon Database', () => {
  test('Fetch subjects', async () => {
    // Test database queries
  });
});
```

Run tests after each phase:
```bash
npm test
```

---

## 🚀 Build Strategy

### Development Builds (After Each Phase)

```bash
# Start local development
npx expo start --dev-client

# Or build for device testing
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Preview Build (Before Production)

```bash
eas build --profile preview --platform all
```

### Production Build (Final)

```bash
eas build --profile production --platform all
```

### Build Checklist Before Each Build

✅ All tests passing (`npm test`)  
✅ No TypeScript errors (`npx tsc --noEmit`)  
✅ No linting errors (`npm run lint`)  
✅ Environment variables set correctly  
✅ All API keys valid  
✅ Database schema migrated  
✅ No console errors in development  

---

## ⚠️ Critical Requirements

### 1. Expo SDK 54 Compatibility
- **Only use packages compatible with Expo SDK 54**
- Check compatibility: https://reactnative.directory/
- Use `npx expo install` for auto-compatible versions

### 2. Build Stability
- **Never use packages that require native code changes** without expo config plugins
- Test builds incrementally - don't wait until the end
- Use `eas build` early and often to catch build issues

### 3. Error Handling
- Wrap all API calls in try-catch blocks
- Provide user-friendly error messages
- Log errors for debugging: `console.error('Context:', error)`
- Handle offline scenarios gracefully

### 4. Type Safety
- Use TypeScript strictly - no `any` types without good reason
- Define interfaces for all data structures
- Use type guards for API responses

### 5. Performance
- Memoize expensive computations with `useMemo`
- Use `useCallback` for callback props
- Optimize FlatList with `getItemLayout` when possible
- Lazy load images and PDFs

---

## 📱 App Configuration

### app.json Updates

Ensure these are configured:

```json
{
  "expo": {
    "name": "Smart Learner",
    "slug": "smart_learner",
    "version": "1.0.0",
    "scheme": "com.tshiamotodd.sidetest",
    "platforms": ["ios", "android"],
    "plugins": [
      "expo-router",
      [
        "react-native-vision-camera",
        {
          "cameraPermission": "Allow Smart Learner to access your camera",
          "enableMicrophonePermission": true
        }
      ],
      [
        "expo-media-library",
        {
          "photosPermission": "Allow Smart Learner to access your photos"
        }
      ],
      "@config-plugins/react-native-pdf",
      "@config-plugins/react-native-blob-util"
    ],
    "ios": {
      "bundleIdentifier": "com.tshiamotodd.smartlearner",
      "infoPlist": {
        "NSCameraUsageDescription": "Smart Learner needs camera access to scan homework",
        "NSPhotoLibraryUsageDescription": "Smart Learner needs photo access to save scanned homework"
      }
    },
    "android": {
      "package": "com.tshiamotodd.smartlearner",
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

---

## 🎯 Success Criteria

### Functional Requirements
✅ Firebase email/password authentication works  
✅ Firebase Google OAuth works  
✅ Neon database CRUD operations work  
✅ Gemini AI generates appropriate chat responses  
✅ Gemini AI generates valid quiz questions  
✅ Google Vision OCR extracts text from images  
✅ YouTube videos play correctly  
✅ ImageKit PDFs load and display  
✅ Camera scans homework on device  
✅ All navigation flows work smoothly  

### Technical Requirements
✅ All tests pass (aim for >80% coverage)  
✅ No TypeScript errors  
✅ No build errors with `eas build`  
✅ App runs on both iOS and Android  
✅ No memory leaks or performance issues  
✅ Offline error handling implemented  

### UI/UX Requirements
✅ Modern, minimalist design throughout  
✅ Consistent color scheme and typography  
✅ Smooth animations and transitions  
✅ Age-appropriate interface  
✅ Accessible (good contrast, readable fonts)  

---

## 📝 Development Workflow

### Step-by-Step Process

1. **Read this entire prompt carefully**
2. **Set up environment variables** (.env file)
3. **Install new dependencies** (Firebase, Neon, Gemini, ImageKit)
4. **Remove old dependencies** (Supabase, OpenAI)
5. **Follow phases sequentially** (1 → 2 → 3 → 4 → 5 → 6)
6. **Write tests for each phase** before moving to next
7. **Run development build** after each phase
8. **Fix any errors** before proceeding
9. **Document any blockers** or questions
10. **Final preview build** before production

### Code Quality Standards

- **Use functional components** with hooks
- **Extract reusable logic** into custom hooks
- **Keep components small** (<200 lines)
- **Use meaningful variable names** (no `x`, `temp`, `data1`)
- **Comment complex logic** (but prefer self-documenting code)
- **Follow Expo best practices**: https://docs.expo.dev/

### Common Pitfalls to Avoid

❌ Don't skip testing phases  
❌ Don't hardcode API keys (use environment variables)  
❌ Don't use `any` type without good reason  
❌ Don't ignore TypeScript errors  
❌ Don't make large commits (commit frequently)  
❌ Don't test camera on Android emulator (use device)  
❌ Don't use packages incompatible with Expo SDK 54  

---

## 🆘 Troubleshooting

### Build Errors

**Issue**: `eas build` fails with dependency errors  
**Solution**: Ensure all packages are Expo SDK 54 compatible, run `npx expo install --check`

**Issue**: Firebase auth not working  
**Solution**: Check Firebase config, ensure auth domain is whitelisted

**Issue**: Neon database connection timeout  
**Solution**: Check connection string, ensure IP is whitelisted in Neon dashboard

### Runtime Errors

**Issue**: Gemini API returns invalid JSON  
**Solution**: Update prompt to explicitly request JSON format, add JSON parsing error handling

**Issue**: Camera permissions not working  
**Solution**: Rebuild app after changing permissions in app.json

**Issue**: PDFs not loading from ImageKit  
**Solution**: Check ImageKit URL endpoint, ensure public key is correct

---

## 📚 Resources

- **Expo SDK 54 Docs**: https://docs.expo.dev/
- **Firebase Auth**: https://firebase.google.com/docs/auth
- **Neon Database**: https://neon.tech/docs
- **Google Gemini**: https://ai.google.dev/docs
- **ImageKit**: https://docs.imagekit.io/
- **React Native**: https://reactnative.dev/
- **NativeWind**: https://www.nativewind.dev/

---

## ✅ Final Checklist

Before submitting the completed project:

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings addressed
- [ ] Code is properly formatted
- [ ] No hardcoded values (use constants/env vars)
- [ ] All console.logs removed or commented

### Testing
- [ ] Unit tests pass for all utilities
- [ ] Integration tests pass for all APIs
- [ ] Component tests pass
- [ ] Manual testing on iOS device/simulator
- [ ] Manual testing on Android device

### Functionality
- [ ] Authentication (email + Google OAuth) works
- [ ] Onboarding flow completes successfully
- [ ] Home dashboard loads subjects
- [ ] Video player works with YouTube
- [ ] Chat with Gemini AI works
- [ ] Camera scans homework
- [ ] OCR extracts text correctly
- [ ] Quiz generation works
- [ ] Past papers PDFs load

### Builds
- [ ] Development build succeeds
- [ ] Preview build succeeds
- [ ] Production build succeeds (optional)
- [ ] App runs without crashes

### Documentation
- [ ] README.md updated with setup instructions
- [ ] Environment variables documented
- [ ] API setup steps documented
- [ ] Known issues documented

---

## 🎓 Final Notes for Gemini AI

- This is a **complete rebuild** of an existing app
- Maintain the **same user experience** and functionality
- Prioritize **build stability** over feature completeness
- Test **incrementally** - don't wait until the end
- Ask questions if requirements are unclear
- Document any deviations from the original app
- Ensure **all error cases** are handled gracefully
- Make the UI **modern, minimalist, and age-appropriate**

**Good luck, and build something amazing!** 🚀
