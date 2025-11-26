import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

interface CameraButtonProps {
    onPress: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    containerStyle?: StyleProp<ViewStyle>;
}

const CameraButton = ({ onPress, iconName, containerStyle }: CameraButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[{
                backgroundColor: 'rgba(0,0,0,0.4)',
                padding: 12,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
            }, containerStyle]}
        >
            <Ionicons name={iconName} size={24} color="white" />
        </TouchableOpacity>
    );
};

export default CameraButton;
