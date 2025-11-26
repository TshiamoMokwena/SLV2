import Navbar from '@/components/Navbar';
import { db } from '@/lib/neon';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Paper {
    id: number;
    paper_name: string;
    file_url: string;
}

export default function ListPapers() {
    const { id, grade, subject, year } = useLocalSearchParams<{ id: string; grade: string; subject: string; year: string }>();
    const router = useRouter();
    const [papers, setPapers] = useState<Paper[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPapers = async () => {
            try {
                setIsLoading(true);
                const gradeNum = parseInt(grade.replace(/\D/g, ''), 10);
                const yearNum = parseInt(year, 10);
                const data = await db.getPastPapers(gradeNum, subject, yearNum) as unknown as Paper[];
                setPapers(data);
            } catch (error) {
                console.error('Error fetching papers:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPapers();
    }, [grade, subject, year]);

    const handlePaperPress = (paper: Paper) => {
        router.push({
            pathname: `/subject/${id}/(pastpapers)/PdfViewer` as RelativePathString,
            params: {
                url: paper.file_url,
                title: paper.paper_name,
                year
            },
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
                heading={`${subject} | ${year}`}
                subHeading="Past Papers"
                showBackButton={true}
            />

            <View className="flex-1 p-4">
                <FlatList
                    data={papers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="bg-white p-5 rounded-xl mb-3 shadow-sm"
                            onPress={() => handlePaperPress(item)}
                        >
                            <Text className="text-lg font-medium text-gray-800 mb-1">
                                {item.paper_name}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {grade} - {year}
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text className="text-center text-gray-500 mt-10">
                            No papers found for this year.
                        </Text>
                    }
                />
            </View>
        </View>
    );
}
