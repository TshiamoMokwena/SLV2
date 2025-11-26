import Navbar from '@/components/Navbar';
import { useOnboarding } from '@/context/OnboardingProvider';
import { Image } from 'expo-image';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function StartQuiz() {
    const { activeSubject } = useOnboarding();
    const { id, topic } = useLocalSearchParams<{ id: string; topic: string }>();
    const router = useRouter();

    return (
        <View className="flex-1 bg-background-light">
            <Navbar
                heading="Start Quiz"
                subHeading={activeSubject?.subjectName}
                showBackButton={true}
            />

            <Image
                source={require('@/assets/images/splash.png')}
                style={{ // Set height relative to the screen
                    height: '50%',
                    aspectRatio: 1, // Maintain aspect ratio
                    resizeMode: 'contain',
                }}
            />

            <View style={{ width: '100%', display: 'flex', padding: 20 }}>
                <Text className='text-2xl text-center text-[#5470FD] mb-3'>Instructions</Text>
                <Text className='text-center mb-2 font-light text-md'>
                    {topic}
                </Text>
                <View style={{ backgroundColor: '#5470FD', borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <Text className='text-white text-lg'>
                        Each Quiz Has Four Options Quiz
                    </Text>
                    <Text className='text-white text-lg'>
                        Progress will be shown at the top
                    </Text>
                    <Text className='text-white text-lg'>
                        Score will be shown at the end.
                    </Text>
                </View>
            </View>

            <View style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                    style={{ backgroundColor: '#5470FD', paddingHorizontal: 10, paddingVertical: 15, borderRadius: 999, width: '50%' }}
                    onPress={() => router.push({
                        pathname: `/subject/${id}/Questions` as RelativePathString,
                        params: { topic: topic }
                    })}
                >
                    <Text className='text-white text-center text-lg'>Start Quiz</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
