import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../lib/firebase';
import { sql } from '../../lib/neon';

export default function SignIn() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.accountCreated === 'true') {
      Alert.alert('Success', 'Account created successfully! Please sign in.');
    }
  }, [params.accountCreated]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check onboarding status
      try {
        const users = await sql`
          SELECT is_onboarded FROM "User" WHERE id = ${userCredential.user.uid}
        `;

        if (users.length > 0 && !users[0].is_onboarded) {
          router.replace('/(onboarding)/School');
        } else {
          router.replace('/(dashboard)/(home)/Home');
        }
      } catch (dbError) {
        console.error('Error checking onboarding status:', dbError);
        // Fallback to home if DB check fails
        router.replace('/(dashboard)/(home)/Home');
      }

    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
        <Text className="text-gray-500 mb-8">Sign in to continue learning</Text>

        <TextInput
          className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white p-4 rounded-xl mb-6 border border-gray-200"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-primary p-4 rounded-xl items-center"
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-white font-bold text-lg">{loading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Link href="/(auth)/SignUp" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
