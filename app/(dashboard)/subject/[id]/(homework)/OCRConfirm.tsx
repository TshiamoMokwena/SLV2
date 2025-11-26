import Navbar from '@/components/Navbar';
import { useFileContext } from '@/context/FileProvider';
import { useOnboarding } from '@/context/OnboardingProvider';
import { AntDesign } from '@expo/vector-icons';
import { RelativePathString, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

const OCRConfirm = () => {
    const { activeSubject } = useOnboarding();
    const { ocrFileContents, fileUri, setocrFileContents } = useFileContext();
    const router = useRouter();

    const [height, setHeight] = useState(0);
    const [inputText, setInputText] = useState<string>(ocrFileContents || "");

    const handleConfirm = () => {
        setocrFileContents(inputText);
        router.dismissAll();
        router.replace(`/(dashboard)/subject/${activeSubject?.subjectId}/(homework)/Homework` as RelativePathString);
    };

    const handleCancel = () => {
        setocrFileContents(null);
        router.dismissAll();
        router.replace(`/(dashboard)/subject/${activeSubject?.subjectId}/(homework)/Homework` as RelativePathString);
    };

    return (
        <View className='flex h-full w-full bg-background-light'>
            <Navbar
                heading="OCR Confirm"
                subHeading={activeSubject?.subjectName || 'Review'}
                showBackButton={true}
            />

            <View className='flex-1 w-full items-center justify-center m-0'>
                <View className='flex-[0.4] w-full px-5 py-2'>
                    <View className='flex-1 w-full shadow-sm'>
                        {fileUri && (
                            <Image
                                source={{ uri: fileUri }}
                                style={{ width: '100%', height: '100%' }}
                                className='rounded-xl'
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </View>

                <View className='flex-[0.6] w-full flex m-0 p-2 justify-between'>
                    <View />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                        className='flex'
                    >
                        <View className='flex w-full p-3 m-0 items-center min-h-[150px]'>
                            <View className={`bg-white flex w-full flex-1 p-1 rounded-xl border border-gray-200 overflow-hidden`}>
                                <View className='flex-[0.8]'>
                                    <TextInput
                                        multiline
                                        value={inputText}
                                        className='w-full flex flex-1 p-3 text-base text-gray-800'
                                        onChangeText={(text) => setInputText(text)}
                                        onContentSizeChange={(event) =>
                                            setHeight(event.nativeEvent.contentSize.height)
                                        }
                                        style={{ height: Math.max(100, height) }}
                                        placeholder='Extracted text will appear here...'
                                    />
                                </View>
                                <View className='flex-[0.2] flex-row items-center justify-between border-t border-gray-100 pt-2 px-2'>
                                    <TouchableOpacity
                                        className='flex flex-row items-center p-2'
                                        onPress={handleCancel}
                                    >
                                        <AntDesign name="close-circle" size={20} color="#EF4444" />
                                        <Text className='text-sm ml-1 text-red-500 font-medium'>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className='flex flex-row items-center p-2'
                                        onPress={handleConfirm}
                                    >
                                        <AntDesign name="check-circle" size={20} color="#10B981" />
                                        <Text className='text-sm ml-1 text-green-500 font-medium'>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </View>
    );
};

export default OCRConfirm;
