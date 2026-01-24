import * as React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { interpolate } from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Expanded Card Dimensions
const CARD_WIDTH = SCREEN_WIDTH * 0.92; // Wider card
const CARD_HEIGHT = SCREEN_HEIGHT * 0.72; // Taller card to contain all text
const CARD_BORDER_RADIUS = 36;

const slides = [
  {
    id: 1,
    title: "Expert Care",
    text: "Access to world-class specialists from the comfort of your home.",
    lottie: require("../assets/images/lottifile/Doctor.json"),
    accent: "#1976D2",
    bgColor: "#F0F7FF", // Subtle blue card tint
  },
  {
    id: 2,
    title: "Secure Records",
    text: "Your health data is protected with end-to-end clinical encryption.",
    lottie: require("../assets/images/lottifile/Doctor.json"),
    accent: "#00897B",
    bgColor: "#F0F9F8", // Subtle teal card tint
  },
  {
    id: 3,
    title: "24/7 Support",
    text: "Instant medical assistance whenever you need it most.",
    lottie: require("../assets/images/lottifile/Doctor.json"),
    accent: "#0288D1",
    bgColor: "#F0F9FF", // Subtle cyan card tint
  },
];

export default function EnhancedCardOnboarding() {
  const router = useRouter();
  const ref = React.useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Smooth Stack Animation: No side peeking, high depth
  const animationStyle = React.useCallback((value) => {
    "worklet";
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const scale = interpolate(value, [-1, 0, 1], [0.85, 1, 1.1]);
    const opacity = interpolate(value, [-0.5, 0, 1], [0, 1, 0]);
    // This translateX logic hides the "peek" by moving the hidden card further away
    const translateX = interpolate(value, [-1, 0, 1], [-SCREEN_WIDTH, 0, SCREEN_WIDTH]);

    return {
      transform: [{ scale }, { translateX }],
      zIndex,
      opacity,
    };
  }, []);

  const renderSlide = ({ item }) => (
    <View style={styles.cardWrapper}>
      <View style={[styles.card, { backgroundColor: item.bgColor }]}>
        <View style={styles.contentContainer}>
          {/* Lottie Animation */}
          <View style={styles.lottieContainer}>
            <LottieView
              source={item.lottie}
              autoPlay
              loop
              style={styles.lottieStyle}
            />
          </View>
          
          {/* Text Content - Now safely inside the card */}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: "#1E293B" }]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.text}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.brandText}>Health<Text style={{color: slides[activeIndex].accent}}>Care</Text></Text>
        </View>

        <View style={styles.carouselWrapper}>
          <Carousel
            ref={ref}
            data={slides}
            loop={false}
            width={SCREEN_WIDTH}
            height={CARD_HEIGHT}
            onSnapToItem={setActiveIndex}
            customAnimation={animationStyle}
            renderItem={renderSlide}
          />
        </View>

        <View style={styles.footer}>
          {/* Progress Indicator */}
          <View style={styles.dotRow}>
            {slides.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  i === activeIndex 
                    ? { width: 30, backgroundColor: slides[activeIndex].accent } 
                    : { width: 8, backgroundColor: '#CBD5E1' }
                ]} 
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => router.replace("/auth/signup")} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.primaryButton, 
                { 
                    backgroundColor: slides[activeIndex].accent,
                    shadowColor: slides[activeIndex].accent 
                }
              ]}
              onPress={() => {
                if (activeIndex < slides.length - 1) {
                  ref.current?.next();
                } else {
                  router.replace("/auth/signup");
                }
              }}
            >
              <Text style={styles.nextBtnText}>
                {activeIndex === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  brandText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1E293B",
    letterSpacing: -1,
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  },
  cardWrapper: {
    width: SCREEN_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieContainer: {
    width: '100%',
    height: '55%',
  },
  lottieStyle: { width: '100%', height: '100%' },
  textContainer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 15,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "800", 
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: { 
    fontSize: 16, 
    color: "#475569", 
    textAlign: "center", 
    lineHeight: 24,
  },
  footer: { 
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
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
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  nextBtnText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});