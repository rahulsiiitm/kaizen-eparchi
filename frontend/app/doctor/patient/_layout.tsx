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
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        {/* Dynamic route for patient details */}
        <Stack.Screen name="[id]" /> 
        <Stack.Screen name="reports" />
        <Stack.Screen name="add_report" />
        <Stack.Screen name="upload" />
      </Stack>
    </>
  );
}