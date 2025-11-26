import { db } from '@/lib/neon';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface OnboardingContextType {
    schoolLevel: string;
    setSchoolLevel: (level: string) => void;
    gradeRange: string;
    setGradeRange: (range: string) => void;
    isOnboarded: boolean | null;
    checkOnboardingStatus: () => Promise<void>;
    saveOnboardingData: (schoolLevel: string, gradeRange: string) => Promise<void>;
    activeSubject: { subjectName: string; subjectId: string } | null;
    setActiveSubject: (subject: { subjectName: string; subjectId: string }) => void;
    loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType>({
    schoolLevel: '',
    setSchoolLevel: () => { },
    gradeRange: '',
    setGradeRange: () => { },
    isOnboarded: null,
    checkOnboardingStatus: async () => { },
    saveOnboardingData: async () => { },
    activeSubject: null,
    setActiveSubject: () => { },
    loading: false,
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [schoolLevel, setSchoolLevel] = useState<string>('');
    const [gradeRange, setGradeRange] = useState<string>('');
    const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
    const [activeSubject, setActiveSubject] = useState<{ subjectName: string; subjectId: string } | null>(null);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (user) {
            checkOnboardingStatus();
        } else {
            setIsOnboarded(null);
        }
    }, [user]);

    const checkOnboardingStatus = async () => {
        if (!user?.uid) return;
        setLoading(true);
        try {
            const users = await db.getUserById(user.uid);
            if (users.length > 0) {
                setIsOnboarded(users[0].is_onboarded);
            }
        } catch (error) {
            console.error('Error checking onboarding status:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveOnboardingData = async (level: string, range: string) => {
        if (!user?.uid) return;

        try {
            await db.saveOnboarding(user.uid, level, range);
            setSchoolLevel(level);
            setGradeRange(range);
            setIsOnboarded(true);
        } catch (error) {
            console.error('Error saving onboarding:', error);
            throw error;
        }
    };

    return (
        <OnboardingContext.Provider
            value={{
                schoolLevel,
                setSchoolLevel,
                gradeRange,
                setGradeRange,
                isOnboarded,
                checkOnboardingStatus,
                saveOnboardingData,
                activeSubject,
                setActiveSubject,
                loading
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};
