import ChatInputSection from '@/components/ChatInputSection';
import Navbar from '@/components/Navbar';
import RenderChatScreen from '@/components/RenderChatScreen';
import { useMessageContext } from '@/context/MessageProvider';
import { useOnboarding } from '@/context/OnboardingProvider';
import React, { useState } from 'react';
import { Image, View } from 'react-native';

const Homework = () => {
    const { messages } = useMessageContext();
    const { activeSubject } = useOnboarding();
    const [isChatActive, setIsChatActive] = useState(false);

    return (
        <View className='flex h-full w-full justify-between bg-background-light'>
            <View className='flex w-full'>
                <Navbar
                    heading="Homework"
                    subHeading={activeSubject?.subjectName || 'AI Tutor'}
                    showBackButton={true}
                />
            </View>

            <View className='flex-1 items-center justify-center w-full'>
                {(isChatActive || messages.length > 0) ? (
                    <View className="flex-1 w-full">
                        <RenderChatScreen
                            messages={messages}
                        />
                    </View>
                ) : (
                    <View className="items-center justify-center opacity-50">
                        <Image
                            source={require('@/assets/images/splash_icon.png')}
                            className='w-64 h-64'
                            resizeMode="contain"
                        />
                    </View>
                )}
            </View>

            <ChatInputSection
                isChatActive={isChatActive}
                setIsChatActive={setIsChatActive}
            />
        </View>
    );
};

export default Homework;
