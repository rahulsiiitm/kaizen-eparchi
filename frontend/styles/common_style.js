import { StyleSheet, Platform, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: "#FBFBFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  bgDecoration: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#007AFF",
    opacity: 0.04,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  content: {
    flex: 1,
  },

  // Typography
  titleSection: {
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 22,
    color: "#444",
    fontWeight: "400",
  },
  brandText: {
    fontSize: 28,
    color: "#007AFF",
    fontWeight: "800",
    textAlign: "center",
  },
  accentBar: {
    width: 40,
    height: 4,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    marginTop: 8,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
  },

  // Buttons
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 42,
    color: "#1A1A1A",
    fontWeight: "300",
  },
  primaryButton: {
    backgroundColor: "#0288D1",
    borderRadius: 18,
    paddingVertical: 16, // Added for consistent sizing
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",

    // Shadow for Android
    elevation: 8,

    // Shadow for iOS
    // We use the same hex as the background for a "colored shadow" effect
    shadowColor: "#0288D1",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35, // Slightly higher opacity to make the color visible
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#B0D4FF",
    elevation: 0,
    shadowOpacity: 0,
  },

  // Inputs
  label: {
    fontSize: 13,
    color: "#1A1A1A",
    marginBottom: 6,
    fontWeight: "700",
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#007AFF",
    elevation: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },

  // Footer Links
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: "auto",
  },
  linkText: {
    color: "#666",
    fontSize: 15,
  },
  linkAction: {
    color: "#007AFF",
    fontWeight: "700",
    fontSize: 15,
  },
  bottomSection: {
    paddingBottom: 40,
    paddingTop: 10,
  },
});
