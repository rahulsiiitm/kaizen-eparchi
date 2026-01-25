import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function PatientLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" }, // Important for transparency
        }}
      >
        <Stack.Screen
          name="[id]"
          options={{ contentStyle: { backgroundColor: "#fff" } }}
        />
        <Stack.Screen
          name="chat"
          options={{ contentStyle: { backgroundColor: "#fff" } }}
        />
        <Stack.Screen name="reports" />
        <Stack.Screen name="add_report" />

        {/* Configured as a Transparent Popup */}
        <Stack.Screen
          name="upload"
          options={{
            presentation: "transparentModal", // Allows seeing the chat behind it
            animation: "fade",
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
