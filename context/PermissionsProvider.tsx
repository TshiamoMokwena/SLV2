import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

interface PermissionsContextType {
    cameraPermission: boolean | null;
    microphonePermission: boolean | null;
    requestCameraPermission: () => Promise<boolean>;
    requestMicrophonePermission: () => Promise<boolean>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissionsContext = () => {
    const context = useContext(PermissionsContext);
    if (!context) {
        throw new Error('usePermissionsContext must be used within a PermissionsProvider');
    }
    return context;
};

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
    const [cameraPermission, requestCamera] = useCameraPermissions();
    const [microphonePermission, requestMicrophone] = useMicrophonePermissions();
    const [camPerm, setCamPerm] = useState<boolean | null>(null);
    const [micPerm, setMicPerm] = useState<boolean | null>(null);

    useEffect(() => {
        if (cameraPermission) {
            setCamPerm(cameraPermission.granted);
        }
        if (microphonePermission) {
            setMicPerm(microphonePermission.granted);
        }
    }, [cameraPermission, microphonePermission]);

    const requestCameraPermission = async () => {
        if (!cameraPermission) return false;
        if (cameraPermission.granted) return true;

        if (!cameraPermission.canAskAgain) {
            Alert.alert(
                "Camera Permission Required",
                "Please enable camera permissions in your settings to use this feature.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
            return false;
        }

        const result = await requestCamera();
        return result.granted;
    };

    const requestMicrophonePermission = async () => {
        if (!microphonePermission) return false;
        if (microphonePermission.granted) return true;

        const result = await requestMicrophone();
        return result.granted;
    };

    return (
        <PermissionsContext.Provider
            value={{
                cameraPermission: camPerm,
                microphonePermission: micPerm,
                requestCameraPermission,
                requestMicrophonePermission,
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
};
