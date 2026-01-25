import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
import { HapticTab } from "../../components/haptic-tab"; //
import { Colors } from "../../constants/theme"; //

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Clean icon-only look
        tabBarButton: HapticTab, // Adds the tactile click feel
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.icon,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
            borderColor: colorScheme === "dark" ? "#333" : "transparent",
            shadowColor: colorScheme === "dark" ? "#000" : "#171717",
          },
        ],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.focusedContainer]}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
              {focused && (
                <View style={[styles.activeDot, { backgroundColor: color }]} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="patient"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.focusedContainer]}
            >
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
                color={color}
              />
              {focused && (
                <View style={[styles.activeDot, { backgroundColor: color }]} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.focusedContainer]}
            >
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
              />
              {focused && (
                <View style={[styles.activeDot, { backgroundColor: color }]} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20, // 👈 Floats slightly above bottom
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 24, // Soft rounded corners
    borderTopWidth: 0,
    elevation: 8, // Android Shadow
    shadowOffset: { width: 0, height: 8 }, // iOS Shadow
    shadowOpacity: 0.1,
    shadowRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0, // Fix alignment
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
  },
  focusedContainer: {
    // Optional: Add subtle background scaling if desired
  },
  activeDot: {
    position: "absolute",
    bottom: -8, // Places the dot below the icon
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
