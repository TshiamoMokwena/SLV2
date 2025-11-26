import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../lib/firebase';
import { sql } from '../../lib/neon';

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      try {
        await sql`
          INSERT INTO "User" (id, email, username, role, is_onboarded)
          VALUES (${userCredential.user.uid}, ${email}, ${username}, 'Student', FALSE)
        `;
      } catch (dbError) {
        console.error('Error creating user in DB:', dbError);
      }

      router.replace({
        pathname: '/(auth)/SignIn',
        params: { accountCreated: 'true' }
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
        <Text className="text-gray-500 mb-8">Join Smart Learner today</Text>

        <TextInput
          className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          className="bg-white p-4 rounded-xl mb-6 border border-gray-200"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-primary p-4 rounded-xl items-center"
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white font-bold text-lg">{loading ? 'Creating Account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/(auth)/SignIn" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
