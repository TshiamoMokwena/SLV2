import { useOnboarding } from '@/context/OnboardingProvider';
import { usePermissionsContext } from '@/context/PermissionsProvider';
import { AntDesign } from '@expo/vector-icons';
import { RelativePathString, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const OpenCameraBtn = () => {
    const router = useRouter();
    const { activeSubject } = useOnboarding();
    const { requestCameraPermission } = usePermissionsContext();

    const handlePress = async () => {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
            router.push(`/(dashboard)/subject/${activeSubject?.subjectId}/(homework)/Camera` as RelativePathString);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} className="ml-3">
            <AntDesign name="camera" size={24} color="gray" />
        </TouchableOpacity>
    );
};

export default OpenCameraBtn;
