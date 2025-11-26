import Navbar from '@/components/Navbar';
import { useOnboarding } from '@/context/OnboardingProvider';
import { db } from '@/lib/neon';
import { Ionicons } from '@expo/vector-icons';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function SelectTopic() {
    const { activeSubject } = useOnboarding();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [topics, setTopics] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTopics();
    }, [id]);

    const loadTopics = async () => {
        console.log({ id })
        try {
            if (id) {
                const result = await db.getQuizTopics(id);
                // Remove duplicates based on title just in case
                const uniqueTopics = result.filter((topic: any, index: number, self: any[]) =>
                    index === self.findIndex((t: any) => t.title === topic.title)
                ).map((t: any) => ({ id: t.id, title: t.title }));
                setTopics(uniqueTopics);
            }
        } catch (error) {
            console.error('Error loading topics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background-light">
                <ActivityIndicator size="large" color="#5470FD" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-light">
            <Navbar
                heading={activeSubject?.subjectName || 'Quiz'}
                subHeading="Select a Topic"
                showBackButton={true}
            />

            <FlatList
                data={topics}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-20">
                        <Text className="text-gray-500 text-lg">No topics available yet.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        key={item.id}
                        className="bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center justify-between"
                        onPress={() =>
                            router.push({
                                pathname: `/subject/${id}/(quiz)/StartQuiz` as RelativePathString,
                                params: { topic: item.title },
                            })
                        }
                    >
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-smartLearner-darkBlue">
                                {item.title}
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Test your knowledge
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#5470FD" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
