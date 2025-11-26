import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Message {
    id: string;
    type: 'text' | 'image';
    content: string;
    sender: 'user' | 'system';
}

interface MessageContextType {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    addMessage: (message: Message) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider');
    }
    return context;
};

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    return (
        <MessageContext.Provider value={{ messages, setMessages, addMessage }}>
            {children}
        </MessageContext.Provider>
    );
};
