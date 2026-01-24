import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// System splash screen-ke dhore rakhar jonno
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // App load hoye gele system splash hide korbe
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="doctor" />
      </Stack>
    </ThemeProvider>
  );
}