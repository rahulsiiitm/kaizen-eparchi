import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import * as React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.92;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;
const CARD_BORDER_RADIUS = 36;

const slides = [
  {
    id: 1,
    title: "Expert Care",
    text: "Access to world-class specialists from the comfort of your home.",
    lottie: require("../assets/images/lottifile/Doctor.json"),
    accent: "#1976D2",
    lightBg: "#F0F7FF",
  },
  {
    id: 2,
    title: "Secure Records",
    text: "Your health data is protected with end-to-end clinical encryption.",
    lottie: require("../assets/images/lottifile/Doctor.json"),
    accent: "#00897B",
    lightBg: "#F0F9F8",
  },
  {
    id: 3,
    title: "24/7 Support",
    text: "Instant medical assistance whenever you need it most.",
    lottie: require("../assets/images/lottifile/Doctor.json"),
    accent: "#0288D1",
    lightBg: "#F0F9FF",
  },
];

export default function EnhancedCardOnboarding() {
  const router = useRouter();
  const ref = React.useRef(null);

  // ⚡ Shared Value for smooth color transitions
  const progress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];
  const isDark = theme === "dark";

  // Extract accent colors for interpolation
  const accentColors = slides.map((s) => s.accent);
  // Create an array of indices [0, 1, 2] for interpolation
  const indices = slides.map((_, i) => i);

  // ⚡ Animated Button Style (Smooth Color Change)
  const animatedButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      indices,
      accentColors,
    );
    return {
      backgroundColor,
      shadowColor: backgroundColor,
    };
  });

  // ⚡ Animated Title "Parchi" Color
  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, indices, accentColors);
    return { color };
  });

  // Stack Animation
  const animationStyle = React.useCallback((value) => {
    "worklet";
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const scale = interpolate(value, [-1, 0, 1], [0.85, 1, 1.1]);
    const opacity = interpolate(value, [-0.5, 0, 1], [0, 1, 0]);
    const translateX = interpolate(
      value,
      [-1, 0, 1],
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    );
    return { transform: [{ scale }, { translateX }], zIndex, opacity };
  }, []);

  const renderSlide = ({ item, index }) => {
    const bgColor = isDark ? "#1E293B" : item.lightBg;
    return (
      <View style={styles.cardWrapper}>
        <View style={[styles.card, { backgroundColor: bgColor }]}>
          <View style={styles.contentContainer}>
            <View style={styles.lottieContainer}>
              <LottieView
                source={item.lottie}
                autoPlay
                loop
                style={styles.lottieStyle}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: activeColors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.subtitle, { color: activeColors.subtext }]}>
                {item.text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <SafeAreaView style={styles.safeArea}>
        {/* ⚡ Header with Layout Fix & Branding Change */}
        <View style={styles.header}>
          <Text style={[styles.brandText, { color: activeColors.text }]}>
            E-<Animated.Text style={animatedTextStyle}>Parchi</Animated.Text>
          </Text>
        </View>

        <View style={styles.carouselWrapper}>
          <Carousel
            ref={ref}
            data={slides}
            loop={false}
            width={SCREEN_WIDTH}
            height={CARD_HEIGHT}
            // ⚡ Update progress shared value directly
            onProgressChange={(_, absoluteProgress) => {
              progress.value = absoluteProgress;
            }}
            onSnapToItem={(index) => setActiveIndex(index)}
            customAnimation={animationStyle}
            renderItem={renderSlide}
          />
        </View>

        <View style={styles.footer}>
          {/* ⚡ Animated Dots */}
          <View style={styles.dotRow}>
            {slides.map((_, i) => {
              // Individual Dot Animation
              const dotStyle = useAnimatedStyle(() => {
                const isActive = Math.abs(progress.value - i) < 0.5;
                const width = interpolate(
                  progress.value,
                  [i - 1, i, i + 1],
                  [8, 30, 8],
                  "clamp",
                );
                const backgroundColor = interpolateColor(
                  progress.value,
                  [i - 1, i, i + 1],
                  [
                    isDark ? "#475569" : "#CBD5E1",
                    slides[i].accent,
                    isDark ? "#475569" : "#CBD5E1",
                  ],
                );
                return { width, backgroundColor };
              });

              return <Animated.View key={i} style={[styles.dot, dotStyle]} />;
            })}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => router.replace("/auth/signup")}
              style={styles.skipBtn}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* ⚡ Animated Button */}
            <TouchableOpacity
              onPress={() => {
                if (activeIndex < slides.length - 1) {
                  ref.current?.next();
                } else {
                  router.replace("/auth/signup");
                }
              }}
            >
              <Animated.View
                style={[styles.primaryButton, animatedButtonStyle]}
              >
                <Text style={styles.nextBtnText}>
                  {activeIndex === slides.length - 1 ? "Get Started" : "Next"}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20, // Increased top padding
    paddingBottom: 10,
    zIndex: 10, // ⚡ Fix overlap
    position: "relative",
  },
  brandText: { fontSize: 28, fontWeight: "900", letterSpacing: -1 },
  carouselWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  cardWrapper: {
    width: SCREEN_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: "hidden",
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  contentContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  lottieContainer: { width: "100%", height: "55%" },
  lottieStyle: { width: "100%", height: "100%" },
  textContainer: { alignItems: "center", marginTop: 30, paddingHorizontal: 15 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  footer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 35,
    gap: 8,
  },
  dot: { height: 8, borderRadius: 4 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: { padding: 12 },
  skipText: { color: "#94A3B8", fontSize: 16, fontWeight: "600" },
  primaryButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 20,
    minWidth: 160,
    alignItems: "center",
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  nextBtnText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});
