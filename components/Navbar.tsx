import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NavbarProps {
    heading: string;
    subHeading?: string;
    showBackButton?: boolean;
}

export default function Navbar({ heading, subHeading, showBackButton = false }: NavbarProps) {
    const router = useRouter();

    return (
        <SafeAreaView edges={['top']} className="bg-background-light">
            <View className="pt-4 pb-4 px-4 bg-white border-b border-gray-100 flex-row items-center">
                {showBackButton && (
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Ionicons name="chevron-back" size={24} color="#5470FD" />
                    </TouchableOpacity>
                )}
                <View className="flex-1">
                    <Text className="text-2xl font-raleway-bold text-smartLearner-darkBlue">
                        {heading}
                    </Text>
                    {subHeading && (
                        <Text className="text-sm font-raleway-light text-gray-500 mt-1">
                            {subHeading}
                        </Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
