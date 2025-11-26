import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingProvider';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
    const { user, signOut } = useAuth();
    const { schoolLevel, gradeRange } = useOnboarding();

    const getSchoolLevelLabel = (level: string) => {
        return level === '1' ? 'Primary School' : 'Secondary School';
    };

    const getGradeRangeLabel = (range: string) => {
        switch (range) {
            case '1': return 'Grade 1 - 3';
            case '2': return 'Grade 4 - 6';
            case '3': return 'Grade 7';
            case '4': return 'Grade 8 - 9';
            case '5': return 'Grade 10 - 12';
            default: return 'Unknown';
        }
    };

    return (
        <View className="flex-1 bg-background-light">
            <Navbar heading="Smart Learner" subHeading="Manage your account" />

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Name Card */}
                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
                    <Text className="text-sm font-raleway-bold text-black mb-1">Name</Text>
                    <Text className="text-base font-raleway-medium text-gray-800">{user?.displayName || 'Student'}</Text>
                </View>

                {/* Email Card */}
                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
                    <Text className="text-sm font-raleway-bold text-black mb-1">Email</Text>
                    <Text className="text-base font-raleway-medium text-gray-800">{user?.email}</Text>
                </View>

                {/* School Level Card */}
                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
                    <Text className="text-sm font-raleway-bold text-black mb-1">School level</Text>
                    <Text className="text-base font-raleway-medium text-gray-800">{getSchoolLevelLabel(schoolLevel)}</Text>
                </View>

                {/* Grade Level Card */}
                <View className="bg-white p-4 rounded-xl mb-8 shadow-sm border border-gray-100">
                    <Text className="text-sm font-raleway-bold text-black mb-1">Grade Level</Text>
                    <Text className="text-base font-raleway-medium text-gray-800">{getGradeRangeLabel(gradeRange)}</Text>
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    className="bg-primary p-4 rounded-full items-center mb-8"
                    onPress={signOut}
                >
                    <Text className="text-white font-bold text-lg">Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
