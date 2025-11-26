import Navbar from '@/components/Navbar';
import { useOnboarding } from '@/context/OnboardingProvider';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function VideoPlayer() {
    const { activeSubject } = useOnboarding();
    const { videoId, videoTitle, videoDescription } = useLocalSearchParams<{
        videoId: string;
        videoTitle: string;
        videoDescription: string;
    }>();
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

    return (
        <View className="flex-1 bg-gray-100">
            <Navbar
                heading={activeSubject?.subjectName || 'Course'}
                subHeading="Now Playing"
                showBackButton={true}
            />

            <View className="flex-1">
                <View className="w-full bg-black aspect-video">
                    <YoutubePlayer
                        height={230}
                        play={playing}
                        videoId={videoId}
                        onChangeState={onStateChange}
                    />
                </View>

                <View className="p-4 bg-white flex-1">
                    <Text className="text-xl font-bold text-gray-900 mb-2">
                        {videoTitle}
                    </Text>
                    <Text className="text-gray-600 leading-6">
                        {videoDescription}
                    </Text>
                </View>
            </View>
        </View>
    );
}
