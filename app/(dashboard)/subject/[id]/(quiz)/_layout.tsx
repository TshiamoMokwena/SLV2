import { Stack } from 'expo-router';
import React from 'react';

export default function QuizLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SelectTopic" />
            <Stack.Screen name="StartQuiz" />
            <Stack.Screen name="Questions" />
            <Stack.Screen name="Score" />
        </Stack>
    );
}
