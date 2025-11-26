

import { GoogleGenAI } from '@google/genai';

// Define the expected structure for a quiz question
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

// Ensure the API key is accessible (via environment variable system if using Expo)
// The SDK can often automatically detect the GEMINI_API_KEY environment variable if it's set.
// If using Expo and process.env.EXPO_PUBLIC_GEMINI_API_KEY, handle the API key explicitly.

const apiKey: string = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || "").trim();

if (!apiKey) {
    console.error("EXPO_PUBLIC_GEMINI_API_KEY is not defined or empty.");
}

// Initialize the client.
const ai = new GoogleGenAI({ apiKey: apiKey || undefined });


/**
 * Generates a multiple-choice quiz using the Gemini 2.0 Flash model.
 * @param {string} topic The specific topic for the quiz.
 * @param {string} subjectName The broader subject name.
 * @returns {Promise<QuizQuestion[]>} A promise that resolves to an array of quiz questions.
 */
export const generateQuizQuestions = async (topic: string, subjectName: string): Promise<QuizQuestion[]> => {
    if (!apiKey && !process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing. Cannot generate quiz.");
    }

    try {
        // Use the models.generateContent method directly
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash", // Use the desired model name here
            contents: `Create a multiple-choice quiz about "${topic}" for the subject "${subjectName}". 
            Provide exactly 2 questions. 
            Each question must have 4 options and one correct answer. 
            Return the result ONLY as a JSON array with this structure: 
            [
              { 
                "question": "string", 
                "options": ["string", "string", "string", "string"], 
                "correctAnswer": "string" 
              }
            ]
            Do not include any markdown formatting or code blocks. Just the raw JSON.`,
        });

        const responseText = result.text;
        if (!responseText) {
            throw new Error("Gemini response is empty or undefined.");
        }

        // Clean up the response if it contains markdown code blocks
        const cleanedText: string = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        // Parse the JSON string and explicitly cast the type
        const quizData: QuizQuestion[] = JSON.parse(cleanedText);

        return quizData;

    } catch (error) {
        console.error("Error generating quiz:", error);
        // Re-throw the error so the calling function can handle it
        throw error;
    }
};

/**
 * Generates a response from the Gemini model for a chat interface.
 * @param {string} prompt The user's message.
 * @param {any[]} history The chat history (optional).
 * @returns {Promise<string>} The model's response.
 */
export const generateChatResponse = async (prompt: string, history: any[] = []): Promise<string> => {
    if (!apiKey && !process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing.");
    }

    try {
        // Construct the conversation history
        const contents = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Add the current user prompt
        contents.push({
            role: 'user',
            parts: [{ text: prompt }]
        });

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contents,
        });

        const response = result.text;

        if (!response) {
            throw new Error("Empty response from Gemini.");
        }

        return response;

    } catch (error) {
        console.error("Error generating chat response:", error);
        throw error;
    }
};

