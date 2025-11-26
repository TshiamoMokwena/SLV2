import { Stack } from 'expo-router';
import React from 'react';

export default function PastPapersLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="GradeCheck" />
            <Stack.Screen name="SelectYear" />
            <Stack.Screen name="ListPapers" />
            <Stack.Screen name="PdfViewer" />
        </Stack>
    );
}
