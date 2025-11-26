import { useFileContext } from '@/context/FileProvider';
import { useMessageContext } from '@/context/MessageProvider';
import { useOnboarding } from '@/context/OnboardingProvider';
import { generateChatResponse } from '@/utils/gemini';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import OpenCameraBtn from './OpenCameraBtn';
import UploadFileBtn from './UploadFileBtn';

const ChatInputSection = ({
    setIsChatActive,
    isChatActive
}: {
    isChatActive: boolean;
    setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { ocrFileContents, setocrFileContents } = useFileContext();
    const { setMessages, messages, addMessage } = useMessageContext();
    const { gradeRange, activeSubject } = useOnboarding();

    const [height, setHeight] = useState(35);
    const [inputTextValue, setInputTextValue] = useState(ocrFileContents || "");
    const [isLoading, setIsLoading] = useState(false);

    // Update input text if OCR content changes
    React.useEffect(() => {
        if (ocrFileContents) {
            setInputTextValue(ocrFileContents);
            // Clear OCR content after loading it into input to avoid re-triggering
            setocrFileContents(null);
        }
    }, [ocrFileContents]);

    const sendMessage = async () => {
        if (!inputTextValue.trim()) return;

        const userMessage = { id: Date.now().toString(), type: 'text' as const, content: inputTextValue, sender: 'user' as const };
        addMessage(userMessage);
        setInputTextValue('');
        setIsChatActive(true);
        setIsLoading(true);

        try {
            // Prepare history for Gemini
            const history = messages.map(msg => ({
                role: msg.sender,
                content: msg.content
            }));

            const responseText = await generateChatResponse(inputTextValue, history);

            const aiMessage = {
                id: Date.now().toString(),
                type: 'text' as const,
                content: responseText,
                sender: 'system' as const,
            };
            addMessage(aiMessage);

        } catch (error: any) {
            console.error('Failed to send message:', error);
            const errorMessage = {
                id: Date.now().toString(),
                type: 'text' as const,
                content: "Sorry, I'm having trouble connecting. Please try again later.",
                sender: 'system' as const
            };
            addMessage(errorMessage);
            Alert.alert('Error', 'Failed to get response from AI.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            className='flex w-full'
        >
            <View className='w-full bg-[#afbcff] p-4 rounded-t-3xl'>
                <View className='bg-white/20 rounded-xl p-2 mb-3'>
                    <TextInput
                        value={inputTextValue}
                        onChangeText={setInputTextValue}
                        multiline
                        className='text-white text-base max-h-32 min-h-[40px]'
                        placeholder='Ask your AI tutor...'
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        onContentSizeChange={(event) => {
                            setHeight(Math.max(35, event.nativeEvent.contentSize.height));
                        }}
                    />
                </View>

                <View className='flex-row justify-between items-center'>
                    <View className='flex-row gap-4'>
                        <UploadFileBtn />
                        <OpenCameraBtn />
                    </View>

                    <TouchableOpacity
                        className={`p-2 rounded-full ${!inputTextValue.trim() && !isLoading ? 'bg-white/30' : 'bg-white'}`}
                        onPress={sendMessage}
                        disabled={!inputTextValue.trim() || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#5470FD" />
                        ) : (
                            <Ionicons name="arrow-up" size={24} color={!inputTextValue.trim() ? "rgba(255,255,255,0.5)" : "#5470FD"} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatInputSection;
