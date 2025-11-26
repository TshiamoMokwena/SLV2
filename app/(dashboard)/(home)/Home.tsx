import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingProvider';
import { db } from '@/lib/neon';
import { Ionicons } from '@expo/vector-icons';
import { RelativePathString, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

interface Subject {
    subject_id: string;
    subject_name: string;
}

export default function Home() {
    const { schoolLevel, gradeRange, setSchoolLevel, setGradeRange, setActiveSubject } = useOnboarding();
    const { user } = useAuth();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchDataAndLoadSubjects();
    }, [user]);

    const fetchDataAndLoadSubjects = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // 1. Fetch onboarding data if not already in context (or force refresh)
            const onboardingResult = await db.getOnboarding(user.uid);

            let currentSchoolLevel = schoolLevel;
            let currentGradeRange = gradeRange;

            if (onboardingResult && onboardingResult.length > 0) {
                const data = onboardingResult[0];
                currentSchoolLevel = data.school_level;
                currentGradeRange = data.grade_range;

                // Update context
                setSchoolLevel(currentSchoolLevel);
                setGradeRange(currentGradeRange);
            }

            // 2. Fetch subjects
            if (currentSchoolLevel && currentGradeRange) {
                const result = await db.getSubjects(currentSchoolLevel, currentGradeRange);
                setSubjects(result as any);
            }
        } catch (error) {
            console.error('Error loading home data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchDataAndLoadSubjects();
    }, [user]);

    const navigateToSubject = (subjectId: string, subjectName: string) => {
        setActiveSubject({ subjectName, subjectId });
        router.push(`/subject/${subjectId}/Options?name=${subjectName}` as RelativePathString);
    };

    if (loading && !refreshing) {
        return (
            <View className="flex-1 justify-center items-center bg-background-light">
                <ActivityIndicator size="large" color="#5470FD" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-light">
            <Navbar heading="Smart Learner" />

            <View className="flex-1 px-4 pt-4">
                {subjects.length === 0 && !loading ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-500">No subjects found for your grade.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={subjects}
                        keyExtractor={(item) => item.subject_id.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5470FD']} />
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigateToSubject(item.subject_id, item.subject_name)}
                                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center justify-between"
                            >
                                <View>
                                    <Text className="text-lg font-raleway-bold text-smartLearner-darkBlue">
                                        {item.subject_name}
                                    </Text>
                                    <Text className="text-gray-500 text-sm mt-1 font-raleway-regular">
                                        Explore this subject
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#5470FD" />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </View>
    );
}
