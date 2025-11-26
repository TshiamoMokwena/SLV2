import { Message } from '@/context/MessageProvider'
import { format } from "date-fns"
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import Markdown from 'react-native-markdown-display'


const RenderChatScreen = ({ messages }: { messages: Message[] }) => {

    const renderMessage = ({ item }: { item: Message }) => {
        return (
            <View
                key={item.id}
                style={{
                    alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor: item.sender === "user" ? "#afbcff" : "#636360",
                    padding: 10,
                    borderRadius: 10,
                    marginVertical: 5,
                    maxWidth: "75%",
                    width: '100%'
                }}
                className='flex flex-col'
            >
                {item.sender === "user" ? (
                    <Text style={{ color: item.sender === "user" ? "white" : "white" }} className='text-sm'>
                        {item.content}
                    </Text>

                ) : (
                    <Markdown
                        style={{
                            body: { color: "white", fontSize: 14 },
                            strong: { fontWeight: 'bold' },
                            paragraph: { marginBottom: 8 },
                            list_item: { flexDirection: 'row', alignItems: 'flex-start' },
                            bullet_list: { marginVertical: 4 },
                            ordered_list: { marginVertical: 4 }
                        }}
                    >
                        {item.content}
                    </Markdown>
                )}
                <Text className='text-[10px] text-gray-200 text-right'>
                    {format(Date.now(), "MMMM do, yyyy H:mma")}
                </Text>
            </View>
        )
    }

    return (
        <View className='bg-[#e0e1e6] p-5 flex-1 w-full'>
            <FlatList
                className={'flex-1 p-0 mt-2 w-full'}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 10 }}
            />
        </View>
    )
}

export default RenderChatScreen