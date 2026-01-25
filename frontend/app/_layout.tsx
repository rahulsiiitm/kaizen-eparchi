import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Entry routes */}
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />

        {/* Auth Group */}
        <Stack.Screen name="auth" options={{ animation: "fade" }} />

        {/* Main App Navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* ⚡ UPDATED: Dialog Box Configuration */}
        <Stack.Screen
          name="addPatient"
          options={{
            presentation: "transparentModal", // Makes it overlay with transparency
            animation: "fade", // Smooth fade-in effect
            headerShown: false, // We will build our own custom header inside the dialog
          }}
        />

        {/* Doctor screens */}
        <Stack.Screen name="doctor" />
      </Stack>
    </ThemeProvider>
  );
}
