import React, { useState } from 'react'
import { Image, View } from 'react-native'

import ChatInputSection from '@/components/ChatInputSection'
import Navbar from '@/components/Navbar'
import RenderChatScreen from '@/components/RenderChatScreen'
import { useMessageContext } from '@/context/MessageProvider'

const Homework = () => {
    const { messages } = useMessageContext()
    const [isChatActive, setIsChatActive] = useState(false)


    return (
        <View className='flex h-full w-full justify-between bg-slate-300'>
            <View className='flex w-full'>
                <Navbar
                    heading="Homework"
                    subHeading="Start a conversation with your AI teacher"
                />
            </View>

            <View className='flex-1 items-center justify-center'>
                {(isChatActive || messages.length > 0) ? (
                    <RenderChatScreen
                        messages={messages}
                    />
                ) : (
                    <Image
                        source={require('@/assets/images/splash_image.png')}
                        className='w-3/4 h-3/4'
                        resizeMode="contain"
                    />
                )}
            </View>

            <ChatInputSection
                isChatActive={isChatActive}
                setIsChatActive={setIsChatActive}
            />
        </View>
    )
}

export default Homework