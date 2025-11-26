import { useOnboarding } from '@/context/OnboardingProvider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const gradeRanges = [
    { label: 'Grade 1 - 3', value: '1' },
    { label: 'Grade 4 - 6', value: '2' },
    { label: 'Grade 7', value: '3' },
    { label: 'Grade 8 - 9', value: '4' },
    { label: 'Grade 10 - 12', value: '5' },
];

export default function Grade() {
    const { schoolLevel, saveOnboardingData } = useOnboarding();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSelection = async (range: string) => {
        setLoading(true);
        try {
            await saveOnboardingData(schoolLevel, range);
            router.replace('/(dashboard)/(home)/Home');
        } catch (error) {
            console.error('Error saving grade:', error);
            Alert.alert('Error', 'Failed to save selection. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 p-6 justify-center">
                <Text className="text-3xl font-bold text-center mb-8 text-primary">
                    Select Your Grade
                </Text>

                {gradeRanges.map((grade) => (
                    <TouchableOpacity
                        key={grade.value}
                        onPress={() => handleSelection(grade.value)}
                        disabled={loading}
                        className="bg-white p-6 rounded-2xl mb-4 shadow-sm border border-gray-100"
                    >
                        <Text className="text-smartLearner-darkBlue text-xl font-semibold text-center">
                            {grade.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}
