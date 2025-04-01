import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  useFonts({
    montserrat: require("./../assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-medium": require("./../assets/fonts/Montserrat-Medium.ttf"),
    "montserrat-bold": require("./../assets/fonts/Montserrat-Bold.ttf"),
  });
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
    </Stack>
  );
}
