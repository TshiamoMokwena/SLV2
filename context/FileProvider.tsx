import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FileContextType {
    fileUri: string | null;
    setFileUri: (uri: string | null) => void;
    fileName: string | null;
    setFileName: (name: string | null) => void;
    ocrFileContents: string | null;
    setocrFileContents: (content: string | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [ocrFileContents, setocrFileContents] = useState<string | null>(null);

    return (
        <FileContext.Provider
            value={{
                fileUri,
                setFileUri,
                fileName,
                setFileName,
                ocrFileContents,
                setocrFileContents,
            }}
        >
            {children}
        </FileContext.Provider>
    );
};
