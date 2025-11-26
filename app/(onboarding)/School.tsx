import { useOnboarding } from '@/context/OnboardingProvider';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const schoolLevels = [
    { label: 'Primary School', value: '1' },
    { label: 'Secondary School', value: '2' },
];

export default function School() {
    const { setSchoolLevel } = useOnboarding();
    const router = useRouter();

    const handleSelection = (level: string) => {
        setSchoolLevel(level);
        router.push('/(onboarding)/Grade');
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 p-6 justify-center">
                <Text className="text-3xl font-bold text-center mb-8 text-primary">
                    Select Your School Level
                </Text>

                {schoolLevels.map((level) => (
                    <TouchableOpacity
                        key={level.value}
                        onPress={() => handleSelection(level.value)}
                        className="bg-white p-6 rounded-2xl mb-4 shadow-sm border border-gray-100"
                    >
                        <Text className="text-smartLearner-darkBlue text-xl font-semibold text-center">
                            {level.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}
