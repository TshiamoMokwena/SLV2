import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface OptionCardProps {
    label: string;
    subTitle: string;
    onPressAction: () => void;
}

export default function OptionCard({ label, subTitle, onPressAction }: OptionCardProps) {
    return (
        <TouchableOpacity
            onPress={onPressAction}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 flex-row items-center justify-between w-full"
        >
            <View className="flex-1">
                <Text className="text-lg font-raleway-bold text-smartLearner-darkBlue mb-1">
                    {label}
                </Text>
                <Text className="text-sm font-raleway-regular text-gray-500">
                    {subTitle}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#5470FD" />
        </TouchableOpacity>
    );
}
