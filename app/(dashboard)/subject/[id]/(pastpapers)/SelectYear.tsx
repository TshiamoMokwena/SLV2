import Navbar from '@/components/Navbar';
import { db } from '@/lib/neon';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function SelectYear() {
    const { id, grade, subject } = useLocalSearchParams<{ id: string; grade: string; subject: string }>();
    const router = useRouter();
    const [years, setYears] = useState<{ year: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadYears = async () => {
            try {
                setIsLoading(true);
                // Extract grade number from "Grade 10" string
                const gradeNum = parseInt(grade.replace(/\D/g, ''), 10);
                const data = await db.getAvailableYears(gradeNum, subject);
                setYears(data);
            } catch (error) {
                console.error('Error fetching years:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadYears();
    }, [grade, subject]);

    const handleYearPress = (year: number) => {
        router.push({
            pathname: `/subject/${id}/(pastpapers)/ListPapers` as RelativePathString,
            params: { grade, subject, year: year.toString() },
        });
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
                heading={subject}
                subHeading="Select Year"
                showBackButton={true}
            />

            <View className="flex-1 p-4">
                <FlatList
                    data={years}
                    keyExtractor={(item) => item.year.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="bg-white p-5 rounded-xl mb-3 shadow-sm flex-row justify-between items-center"
                            onPress={() => handleYearPress(item.year)}
                        >
                            <Text className="text-lg font-medium text-gray-800">
                                {item.year}
                            </Text>
                            <Text className="text-primary font-bold">→</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-10">
                            No past papers found for this subject.
                        </Text>
                    }
                />
            </View>
        </View>
    );
}
