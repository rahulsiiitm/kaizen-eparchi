/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#007AFF";
const tintColorDark = "#0A84FF";

export const Colors = {
  light: {
    text: "#111827",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    // New Semantic Colors
    card: "#F9FAFB",
    cardBorder: "#F3F4F6",
    inputBackground: "#F3F4F6",
    inputText: "#111827",
    inputPlaceholder: "#9CA3AF",
    subtext: "#6B7280",
    danger: "#DC2626",
    success: "#10B981",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // New Semantic Colors
    card: "#252525",
    cardBorder: "#2C2C2E",
    inputBackground: "#2C2C2E",
    inputText: "#ECEDEE",
    inputPlaceholder: "#9BA1A6",
    subtext: "#9CA3AF",
    danger: "#EF4444",
    success: "#34D399",
  },
};
