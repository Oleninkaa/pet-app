import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  useFonts({
    montserrat: require("./../assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-medium": require("./../assets/fonts/Montserrat-Medium.ttf"),
    "montserrat-bold": require("./../assets/fonts/Montserrat-Bold.ttf"),
  });
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login/home" options={{ headerShown: false }} />
        <Stack.Screen name="login/" options={{ headerShown: false }} />
        <Stack.Screen name="/(home)" options={{ headerShown: false }} />
        <Stack.Screen name="/(auth)/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="/(auth)/sign-up" options={{ headerShown: false }} />
    </Stack>
    </ClerkProvider>
    
  );
}
