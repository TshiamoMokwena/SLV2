import { FileProvider } from '@/context/FileProvider';
import { MessageProvider } from '@/context/MessageProvider';
import { PermissionsProvider } from '@/context/PermissionsProvider';
import { Stack } from 'expo-router';
import React from 'react';

const HomeworkRootLayout = () => {
    return (
        <FileProvider>
            <MessageProvider>
                <PermissionsProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Homework" />
                        <Stack.Screen name="OCRConfirm" />
                        <Stack.Screen name="Camera" />
                    </Stack>
                </PermissionsProvider>
            </MessageProvider>
        </FileProvider>
    );
};

export default HomeworkRootLayout;
