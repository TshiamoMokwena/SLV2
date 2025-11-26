import * as FileSystem from 'expo-file-system';

const GOOGLE_CLOUD_VISION_API_KEY = process.env.EXPO_PUBLIC_CLOUD_VISION_API_KEY;
const GOOGLE_CLOUD_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

export const analyzeImage = async (imageUri: string) => {
    try {
        if (!GOOGLE_CLOUD_VISION_API_KEY) {
            throw new Error("Google Cloud Vision API Key is missing.");
        }

        const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
        });

        const requestBody = {
            requests: [
                {
                    image: {
                        content: base64ImageData,
                    },
                    features: [
                        {
                            type: "TEXT_DETECTION",
                            maxResults: 1,
                        },
                    ],
                },
            ],
        };

        const response = await fetch(GOOGLE_CLOUD_VISION_API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.responses && result.responses[0].error) {
            throw new Error(result.responses[0].error.message);
        }

        return result;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
};
