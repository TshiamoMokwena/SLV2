import Navbar from '@/components/Navbar';
import { useOnboarding } from '@/context/OnboardingProvider';
import { db } from '@/lib/neon';
import { extractYouTubeVideoId, fetchYouTubeThumbnail } from '@/utils/youtube';
import { Ionicons } from '@expo/vector-icons';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Video {
    id?: number;
    title: string;
    description: string;
    video_url: string;
    thumbnail?: string;
    channelTitle?: string;
}

export default function VideoList() {
    const { activeSubject } = useOnboarding();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [subjectVideos, setSubjectVideos] = useState<Video[]>([]);
    const [searchResults, setSearchResults] = useState<Video[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjectVideos();
    }, [id]);

    const fetchSubjectVideos = async () => {
        try {
            setLoading(true);
            const videos = await db.getSubjectVideos(id);

            const videosWithThumbnails = await Promise.all(
                videos.map(async (video: any) => {
                    const videoId = extractYouTubeVideoId(video.video_url);
                    const thumbnail = await fetchYouTubeThumbnail(videoId);
                    return { ...video, thumbnail };
                })
            );

            setSubjectVideos(videosWithThumbnails);
        } catch (error) {
            console.error('Error fetching videos:', error);
            Alert.alert('Error', 'Failed to fetch subject videos');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setIsSearching(false);
            return;
        }

        try {
            setLoading(true);
            setIsSearching(true);
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchQuery}&key=${process.env.EXPO_PUBLIC_YOUTUBE_API_KEY}`
            );

            if (response.ok) {
                const data = await response.json();
                const items = data.items.map((item: any) => ({
                    title: item.snippet.title,
                    description: item.snippet.description,
                    video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    thumbnail: item.snippet.thumbnails.high.url,
                    channelTitle: item.snippet.channelTitle
                }));
                setSearchResults(items);
            } else {
                console.error('Failed to search videos:', response.status);
                Alert.alert('Error', 'Failed to search for videos');
            }
        } catch (error) {
            console.error('Error searching videos:', error);
            Alert.alert('Error', 'Failed to search for videos');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Video }) => (
        <TouchableOpacity
            className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden"
            onPress={() => {
                const videoId = extractYouTubeVideoId(item.video_url);
                router.push({
                    pathname: `/subject/${id}/(course)/VideoPlayer` as RelativePathString,
                    params: {
                        videoId,
                        videoTitle: item.title,
                        videoDescription: item.description
                    }
                });
            }}
        >
            <Image
                source={{ uri: item.thumbnail }}
                className="w-full h-48"
                resizeMode="cover"
            />
            <View className="p-4">
                <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
                    {item.title}
                </Text>
                {item.channelTitle && (
                    <Text className="text-sm text-gray-500 mb-1">{item.channelTitle}</Text>
                )}
                <Text className="text-gray-600 text-sm" numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-100">
            <Navbar
                heading={activeSubject?.subjectName || 'Course'}
                subHeading="Video Library"
                showBackButton={true}
            />

            <View className="p-4">
                <View className="flex-row items-center space-x-2 mb-4">
                    <View className="flex-1 bg-white rounded-full border border-gray-200 px-4 py-2 flex-row items-center">
                        <Ionicons name="search" size={20} color="#9ca3af" />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Search for videos..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                    </View>
                    <TouchableOpacity
                        className="bg-primary p-3 rounded-full"
                        onPress={handleSearch}
                    >
                        <Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center py-10">
                        <ActivityIndicator size="large" color="#5470FD" />
                    </View>
                ) : (
                    <FlatList
                        data={isSearching ? searchResults : subjectVideos}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.video_url + index}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center py-10">
                                <Text className="text-gray-500 text-lg text-center">
                                    {isSearching ? 'No videos found' : 'No videos available for this subject'}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}
