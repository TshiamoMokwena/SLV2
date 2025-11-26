import * as FileSystem from 'expo-file-system';

export const analyzeImage = async (imageUri: string) => {
    try {
        if (!imageUri) {
            return { error: "No image provided" };
        }

        const fileContent = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        const apiKey = process.env.EXPO_PUBLIC_CLOUD_VISION_API_KEY;
        const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

        const requestData = {
            requests: [
                {
                    image: {
                        content: fileContent
                    },
                    features: [
                        {
                            type: 'TEXT_DETECTION',
                            maxResults: 5
                        }
                    ]
                }
            ]
        }

        const apiResponse = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(requestData)
        })

        const data = await apiResponse.json();
        return data;

    } catch (error: any) {
        console.error('Error analyzing image: ', error);
        return { error: error.message || "Error analyzing image" };
    }
}