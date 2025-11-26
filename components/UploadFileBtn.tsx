import { useFileContext } from '@/context/FileProvider';
import { useOnboarding } from '@/context/OnboardingProvider';
import { analyzeImage } from '@/utils/ocr';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { RelativePathString, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';

const UploadFileBtn = () => {
    const { setFileUri, setocrFileContents } = useFileContext();
    const { activeSubject } = useOnboarding();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setIsLoading(true);
                const uri = result.assets[0].uri;
                setFileUri(uri);

                // Analyze image
                const ocrResult = await analyzeImage(uri);

                if (ocrResult && ocrResult.responses && ocrResult.responses[0].fullTextAnnotation) {
                    setocrFileContents(ocrResult.responses[0].fullTextAnnotation.text);
                    router.push(`/(dashboard)/subject/${activeSubject?.subjectId}/(homework)/OCRConfirm` as RelativePathString);
                } else {
                    Alert.alert("No Text Found", "Could not detect any text in the image.");
                }
            }
        } catch (error: any) {
            console.error("Error picking image:", error);
            Alert.alert("Error", error.message || "Failed to pick image");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableOpacity onPress={pickImage} disabled={isLoading}>
            {isLoading ? (
                <ActivityIndicator size="small" color="#5470FD" />
            ) : (
                <AntDesign name="file-add" size={24} color="gray" />
            )}
        </TouchableOpacity>
    );
};

export default UploadFileBtn;
