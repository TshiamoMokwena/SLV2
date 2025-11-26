import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';

import { useFileContext } from '@/context/FileProvider';
import { Message, useMessageContext } from '@/context/MessageProvider';
import { useOnboarding } from '@/context/OnboardingProvider';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenCameraBtn from './OpenCameraBtn';
import UploadFileBtn from './UploadFileBtn';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

const primaryGradeLevels = [
    { label: 'Grade 1 - 3', value: '1' },
    { label: 'Grade 4 - 6', value: '2' },
    { label: 'Grade 7', value: '3' },
];

const ChatInputSection = ({
    setIsChatActive,
    isChatActive
}: {
    isChatActive: boolean;
    setIsChatActive: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { ocrFileContents } = useFileContext()
    const { setMessages, messages } = useMessageContext()
    const { gradeRange, activeSubject } = useOnboarding()

    const [height, setHeight] = useState(35);
    const [margin, setMargin] = useState(0);
    const [isKeyboardActive, setIsKeyboardActive] = useState(false)
    const [inputTextValue, setInputTextValue] = useState(ocrFileContents || "")

    const sendMessage = async () => {
        const userMessage: Message = { id: Date.now().toString(), type: 'text', content: inputTextValue, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);

        setInputTextValue('')

        // Gemini response
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const gradeLabel = primaryGradeLevels.find((grade) => grade.value === gradeRange)?.label || "Grade 1 - 3";
            const prompt = `
                You are an AI tutor designed to assist South African students in ${gradeLabel} with their homework.
                Your goal is to provide clear and concise explanations, examples, and guidance in relation to ${activeSubject} as a subject the current student is enrolled in.
                Please ensure that your responses are tailored to the South African curriculum and educational standards.

    History:
                ${messages.map((msg) => `${msg.sender}: ${msg.content}`).join('\n')}

User: ${inputTextValue}
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const aiMessage: Message = {
                id: Date.now().toString(),
                type: 'text',
                content: text || 'Sorry, I did not understand that...',
                sender: 'system',
            };
            setMessages((prev) => [...prev, aiMessage])

        } catch (error: any) {
            console.error('Failed to send message to Gemini', error);
            const aiMessage: Message = {
                id: Date.now().toString(),
                type: 'text',
                content: "Sorry, I'm having trouble connecting to Gemini. Please try again later.",
                sender: 'system'
            }
            setMessages((prev) => [...prev, aiMessage])
            Alert.alert('Failed to send message to Gemini', error.message);

        }
    }

    const displayChat = () => {
        if (inputTextValue.trim().length === 0) return;
        inputTextValue && sendMessage()
        setIsChatActive(true)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust based on header height
            className='flex'
        >
            <View className='flex w-full p-3 m-0 items-center justify-between min-h-[120px]'>
                <View className='bg-[#afbcff] flex w-full flex-1 p-1 rounded-lg overflow-hidden'>
                    <View className='bg-[#afbcff] flex-[0.6]'>
                        <TextInput
                            value={inputTextValue!}
                            onChangeText={(text) => setInputTextValue(text)}
                            multiline
                            className='w-full flex-1 p-2 bg-[#bbc6ff]'
                            onContentSizeChange={(event) => {
                                const newHeight = Math.max(35, event.nativeEvent.contentSize.height);
                                setHeight(newHeight);
                                setMargin(Math.max(0, 120 - margin));
                            }}
                            style={{ height: height, backgroundColor: '#bbc6ff' }}
                            placeholder='Type a message...'
                        />
                    </View>
                    <View className='bg-[#afbcff] flex-[0.4] flex-row items-center justify-between'>
                        {isKeyboardActive ? (
                            <TouchableOpacity
                                onPress={() => setIsKeyboardActive(false)}
                                className='pl-2'
                            >
                                <AntDesign name="plus" size={20} color="grey" />
                            </TouchableOpacity>
                        ) : (
                            <View className='flex flex-row items-center'>
                                <UploadFileBtn />

                                <OpenCameraBtn />
                            </View>
                        )}

                        <TouchableOpacity
                            className='pr-1'
                            onPress={() => displayChat()}
                        >
                            <AntDesign name="arrow-right" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </KeyboardAvoidingView>
    )
}

export default ChatInputSection