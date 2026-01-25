import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

// ⚡ 1. COMPACT DASHBOARD / LIST STYLES
export const recordStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginLeft: 10,
  },

  // Patient Info
  patientInfoContainer: { paddingHorizontal: 10 },
  patientName: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },

  // List Content
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 4,
  },

  // Visit Card
  visitCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  visitSummary: { fontSize: 15, fontWeight: "600" },

  // Floating Button
  footer: { position: "absolute", bottom: 30, left: 20, right: 20 },
  newConsultBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#007AFF",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});

// ⚡ 2. COMPACT CHAT STYLES (Updated)
export const chatStyles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backBtn: { padding: 4, marginRight: 10 },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  headerSubtitle: { fontSize: 12, fontWeight: "500", marginTop: 1 }, // 👈 Added

  chatArea: { flex: 1, paddingHorizontal: 12 },

  // Messages
  messageRow: {
    flexDirection: "row",
    marginBottom: 4,
    marginTop: 4,
    alignItems: "flex-end",
  },
  doctorRow: { justifyContent: "flex-end" },
  aiRow: { justifyContent: "flex-start" },

  // Bubbles
  bubble: {
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  doctorBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    backgroundColor: "white",
    elevation: 1,
  },

  // Text
  msgText: { fontSize: 15, lineHeight: 22 },
  doctorText: { color: "white" },
  aiText: { color: "#1C1C1E" },

  // Bot Avatar
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 2,
    backgroundColor: "#F2F2F7",
  },

  // File Tags
  fileTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  fileTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    marginLeft: 6,
  },

  // Report View
  reportContainer: { marginTop: 4 },
  summaryBox: { marginBottom: 8 },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryText: { fontSize: 14, lineHeight: 20 },
  diagnosisBox: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  medList: { marginTop: 6 },
  medItem: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  bullet: { width: 4, height: 4, borderRadius: 2, marginRight: 8 },
  medText: { fontSize: 14, fontWeight: "500" },

  // Input Area
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    backgroundColor: "white",
  },
  attachBtn: { padding: 8, marginRight: 4 },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#F2F2F7",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
});

// ⚡ 3. COMPACT UPLOAD STYLES
export const uploadStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  backgroundClickable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  popupCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
  },
  content: { padding: 20 },
  rowContainer: { flexDirection: "row", gap: 12, marginBottom: 20 },
  actionCard: { flex: 1, height: 110 },
  dashedContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#D1D1D6",
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
  },
  listContainer: { marginTop: 0 },
  selectionCount: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    color: "#8E8E93",
    textTransform: "uppercase",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  emptyHint: {
    textAlign: "center",
    color: "#C7C7CC",
    marginTop: 20,
    fontSize: 15,
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#F2F2F7" },
  btn: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
