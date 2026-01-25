import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import {
  Dimensions,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "../constants/theme"; // Import Colors

const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  return (
    <View
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <LottieView
        source={require("../assets/images/lottifile/Doctor.json")}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={() => {
          router.replace("/onboarding");
        }}
      />
      <Text style={[styles.brand, { color: activeColors.text }]}>E-PARCHI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: { width: width * 0.9, height: width },
  brand: { fontSize: 24, fontWeight: "bold", marginTop: 20 },
});
