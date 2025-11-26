import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Score() {
    const { id, score, topic } = useLocalSearchParams<{ id: string; score: string; topic: string }>();
    const router = useRouter();
    const numericScore = parseInt(score || '0', 10);
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Navbar heading="Quiz Results" showBackButton={false} />

            <Image
                source={require('@/assets/images/score_image.png')}
                style={styles.image}
            />
            <View style={styles.scoreContainer}>
                {score === "0" || score === "10" || score === "20" ? (
                    <Text style={styles.scoreText}>
                        Better luck next time! You scored {score} points.
                    </Text>
                ) : score === "30" || score === "40" ? (
                    <Text style={styles.scoreText}>
                        Congratulations!! {user?.email?.split('@')[0]} You Scored {score} Points.
                    </Text>
                ) : (
                    <Text style={styles.scoreText}>
                        Your score is {score} points.
                    </Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        router.dismissAll();
                        router.replace({
                            pathname: `/subject/${id}/SelectTopic` as RelativePathString
                        });
                    }}
                >
                    <Text style={styles.buttonText}>
                        Play Again
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => {
                        router.dismissAll();
                        router.replace({
                            pathname: `/subject/${id}/Options` as RelativePathString
                        });
                    }}
                >
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                        Back to Subject
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9', // bg-background-light
    },
    image: {
        height: '50%',
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    scoreContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    scoreText: {
        fontSize: 18, // text-lg
        marginTop: 8, // mt-2
        color: '#5470FD',
        textAlign: 'center',
        fontWeight: '300', // font-light
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24, // px-6
    },
    button: {
        backgroundColor: '#5470FD',
        padding: 16, // p-4
        marginTop: 16, // mt-4
        borderRadius: 9999, // rounded-full
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16, // text-md (approx)
        textAlign: 'center',
        fontWeight: '300', // font-light
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#5470FD',
    },
    secondaryButtonText: {
        color: '#5470FD',
    },
});
