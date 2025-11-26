import { useFileContext } from '@/context/FileProvider'
import { useOnboarding } from '@/context/OnboardingProvider'
import { analyzeImage } from '@/utils'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as DocumentPicker from 'expo-document-picker'
import { RelativePathString, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'

const UploadFileBtn = () => {
    const {
        setocrFileContents,
        setFileUri,
        setFileName
    } = useFileContext()
    const { activeSubject } = useOnboarding()
    const router = useRouter()

    const openFilePicker = async () => {
        try {
            const doc = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            })

            if (doc.canceled) return;

            console.log(doc)
            setFileUri(doc.assets![0].uri)
            setFileName(doc.assets![0].name)

            const ocrContent = await analyzeImage(doc.assets![0].uri)

            if (ocrContent.error) {
                const errorMessage = typeof ocrContent.error === 'string'
                    ? ocrContent.error
                    : ocrContent.error.message || "Unknown OCR Error";
                Alert.alert("OCR Error", errorMessage)
                return
            }

            setocrFileContents(ocrContent.responses[0].textAnnotations[0].description)
            router.push(`/(dashboard)/subject/${activeSubject?.subjectId}/OCRConfirm` as RelativePathString)

        } catch (error: any) {
            console.error("OpenPDF Error: ", error)
            Alert.alert("Error", error.message)
        }
    }

    return (
        <TouchableOpacity
            onPressIn={openFilePicker}
            className='flex flex-row items-center pl-2'
        >
            <AntDesign name="file-add" size={20} color="gray" />
            <Text className='text-xs ml-1 text-gray-600'>Upload File</Text>
        </TouchableOpacity>
    )
}

export default UploadFileBtn