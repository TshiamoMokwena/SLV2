import Navbar from '@/components/Navbar';
import OptionCard from '@/components/OptionCard';
import { useOnboarding } from '@/context/OnboardingProvider';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function Options() {
    const { activeSubject } = useOnboarding();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    return (
        <View className="flex-1 bg-background-light">
            <Navbar
                heading={activeSubject?.subjectName || 'Subject'}
                subHeading="Select an Option"
                showBackButton={true}
            />

            <ScrollView className="flex-1 px-4 pt-6">
                <OptionCard
                    label="Course"
                    subTitle="Access all courses for this subject"
                    onPressAction={() => router.push(`/subject/${id}/VideoList` as Href)}
                />
                <OptionCard
                    label="Homework"
                    subTitle="Access all homework for this subject"
                    onPressAction={() => router.push(`/subject/${id}/Homework` as Href)}
                />
                <OptionCard
                    label="Quiz"
                    subTitle="Access all quizzes for this subject"
                    onPressAction={() => router.push(`/subject/${id}/(quiz)/SelectTopic` as Href)}
                />
                <OptionCard
                    label="Past Question Papers"
                    subTitle="Access all past question papers for this subject"
                    onPressAction={() => router.push(`/subject/${id}/GradeCheck` as Href)}
                />
            </ScrollView>
        </View>
    );
}
