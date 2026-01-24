import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function DoctorLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          // We hide the header because you are building 
          // your own custom back buttons in your screens
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        {/* The 'name' must match the filename exactly (without extension) */}
        <Stack.Screen name="patient" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="patients" />
      </Stack>
    </>
  );
}