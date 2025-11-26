import { useOnboarding } from '@/context/OnboardingProvider';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { isOnboarded, loading: onboardingLoading } = useOnboarding();

  if (authLoading || (user && onboardingLoading)) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#5470FD" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/SignIn" />;
  }

  return isOnboarded ? (
    <Redirect href="/(dashboard)/(home)/Home" />
  ) : (
    <Redirect href="/(onboarding)/School" />
  );
}
