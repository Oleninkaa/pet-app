import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env file");
}

SplashScreen.preventAutoHideAsync(); // не показуй UI, поки не завантажені шрифти

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    montserrat: require("./../assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-medium": require("./../assets/fonts/Montserrat-Medium.ttf"),
    "montserrat-bold": require("./../assets/fonts/Montserrat-Bold.ttf"),
    inter: require("./../assets/fonts/Inter_Regular.ttf"),
    "inter-bold": require("./../assets/fonts/Inter_Bold.ttf"),
    "inter-semiBold": require("./../assets/fonts/Inter_SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // показати UI, коли шрифти завантажені
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // або покажи кастомний лоадер
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(test)" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
