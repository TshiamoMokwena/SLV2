import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingProvider';
import { db } from '@/lib/neon';
import { Picker } from '@react-native-picker/picker';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';

const primaryGrades = [
    { label: 'Grade 1', value: '1' },
    { label: 'Grade 2', value: '2' },
    { label: 'Grade 3', value: '3' },
    { label: 'Grade 4', value: '4' },
    { label: 'Grade 5', value: '5' },
    { label: 'Grade 6', value: '6' },
    { label: 'Grade 7', value: '7' },
];

const secondaryGrades = [
    { label: 'Grade 8', value: '8' },
    { label: 'Grade 9', value: '9' },
    { label: 'Grade 10', value: '10' },
    { label: 'Grade 11', value: '11' },
    { label: 'Grade 12', value: '12' },
];

export default function GradeCheck() {
    const { schoolLevel, activeSubject } = useOnboarding();
    const { user } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [grade, setGrade] = useState('');
    const [grades, setGrades] = useState(schoolLevel === '1' ? primaryGrades : secondaryGrades);

    useEffect(() => {
        const checkGrade = async () => {
            if (!user?.uid) return;
            try {
                setIsLoading(true);
                const users = await db.getOnboarding(user.uid);
                const data = users[0];

                if (data?.grade) {
                    setIsLoading(false);
                    router.replace({
                        pathname: `/subject/${id}/(pastpapers)/SelectYear` as RelativePathString,
                        params: {
                            grade: `Grade ${data.grade}`,
                            subject: activeSubject?.subjectName,
                        }
                    });
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error checking grade:', error);
                Alert.alert('Error', 'Failed to check grade');
                setIsLoading(false);
            }
        };
        checkGrade();
    }, [user, id, activeSubject]);

    const handleNext = async () => {
        if (!grade) {
            Alert.alert('Error', 'Please select a grade');
            return;
        }

        if (!user?.uid) return;

        try {
            setIsLoading(true);
            await db.updateGrade(user.uid, parseInt(grade, 10));

            router.replace({
                pathname: `/subject/${id}/(pastpapers)/SelectYear` as RelativePathString,
                params: {
                    grade: `Grade ${grade}`,
                    subject: activeSubject?.subjectName,
                }
            });
        } catch (error: any) {
            console.error('Error updating grade:', error);
            Alert.alert('Error', error.message || 'Failed to update grade');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background-light">
                <ActivityIndicator size="large" color="#5470FD" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-light">
            <Navbar
                heading={activeSubject?.subjectName || 'Subject'}
                subHeading="Grade Check"
                showBackButton={true}
            />

            <View className="flex-1 p-6 justify-between">
                <View>
                    <Text className="text-lg font-semibold text-gray-700 mb-4">
                        Please select your actual grade:
                    </Text>
                    <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <Picker
                            selectedValue={grade}
                            onValueChange={(itemValue) => setGrade(itemValue)}
                        >
                            <Picker.Item label="Select Grade" value="" />
                            {grades.map((item, index) => (
                                <Picker.Item label={item.label} value={item.value} key={index} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-primary p-4 rounded-full shadow-md mb-8"
                    onPress={handleNext}
                >
                    <Text className="text-white text-center text-xl font-bold">
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
