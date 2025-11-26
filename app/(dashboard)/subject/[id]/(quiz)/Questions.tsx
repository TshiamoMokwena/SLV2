import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingProvider';
import { db } from '@/lib/neon';
import { generateQuizQuestions } from '@/utils/gemini';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

export default function Questions() {
    const { activeSubject } = useOnboarding();
    const { user } = useAuth();
    const { id, topic } = useLocalSearchParams<{ id: string; topic: string }>();
    const router = useRouter();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const generatedQuestions = await generateQuizQuestions(topic, activeSubject?.subjectName || '');
            if (generatedQuestions && generatedQuestions.length > 0) {
                setQuestions(generatedQuestions);
            } else {
                Alert.alert('Error', 'Failed to generate questions. Please try again.');
                router.back();
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            Alert.alert('Error', 'Failed to generate quiz. Please check your connection.');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleOptionPress = (option: string) => {
        if (selectedOption) return; // Prevent multiple selections

        setSelectedOption(option);
        const correct = option === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore((prev) => prev + 10);
        }
    };

    const handleNext = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            // Quiz finished
            try {
                if (user?.uid && id) {
                    await db.saveQuizScore(user.uid, id, topic, score + (isCorrect ? 10 : 0));
                }
            } catch (error) {
                console.error('Error saving score:', error);
            }

            router.replace({
                pathname: `/subject/${id}/(quiz)/Score` as RelativePathString,
                params: { score: score + (isCorrect ? 10 : 0), topic },
            });
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background-light">
                <ActivityIndicator size="large" color="#5470FD" />
                <Text className="mt-4 text-gray-600 font-raleway-medium">Generating Quiz with AI...</Text>
            </View>
        );
    }

    if (questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <View className="flex-1 bg-background-light">
            <Navbar
                heading="Quiz"
                subHeading={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
            />

            <View className="h-2 bg-gray-200 w-full">
                <View style={{ width: `${progress}%` }} className="h-full bg-primary" />
            </View>

            <View className="flex-1 p-6">
                <Text className="text-xl font-bold text-smartLearner-darkBlue mb-8 leading-8">
                    {currentQuestion.question}
                </Text>

                {currentQuestion.options.map((option, index) => {
                    let backgroundColor = 'bg-white';
                    let textColor = 'text-gray-700';
                    let borderColor = 'border-gray-200';

                    if (selectedOption === option) {
                        if (isCorrect) {
                            backgroundColor = 'bg-green-100';
                            borderColor = 'border-green-500';
                            textColor = 'text-green-800';
                        } else {
                            backgroundColor = 'bg-red-100';
                            borderColor = 'border-red-500';
                            textColor = 'text-red-800';
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            disabled={!!selectedOption}
                            onPress={() => handleOptionPress(option)}
                            className={`p-4 rounded-xl mb-4 border ${borderColor} ${backgroundColor} shadow-sm`}
                        >
                            <Text className={`text-lg font-medium ${textColor}`}>{option}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {selectedOption && (
                <View className="p-6 bg-white border-t border-gray-100">
                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-primary w-full p-4 rounded-full shadow-md"
                    >
                        <Text className="text-white text-center text-xl font-bold">
                            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
