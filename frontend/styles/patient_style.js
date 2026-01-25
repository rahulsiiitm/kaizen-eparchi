import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");
const PRIMARY_BLUE = "#007AFF";

// ==========================================
// 1. Patient Record Screen Styles ([id].jsx)
// ==========================================
export const recordStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "white" },
  backButton: { padding: 5 },
  patientInfoContainer: { paddingHorizontal: 5 },
  patientName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  patientDetails: { fontSize: 16, color: "rgba(255,255,255,0.8)" },

  content: { flex: 1, padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 15,
  },

  visitCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  visitDate: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
    fontWeight: "500",
  },
  visitSummary: { fontSize: 16, color: "#0F172A", fontWeight: "500" },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  newConsultBtn: {
    backgroundColor: "#0088CC",
    borderRadius: 30,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#0088CC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});

// ==========================================
// 2. Chat Screen Styles (chat.jsx)
// ==========================================
export const chatStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B" },
  chatArea: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },

  messageRow: { flexDirection: "row", marginBottom: 20 },
  doctorRow: { justifyContent: "flex-end" },
  aiRow: { justifyContent: "flex-start" },

  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },

  bubble: { padding: 14, borderRadius: 18, maxWidth: "80%" },
  aiBubble: { backgroundColor: "#F1F5F9", borderTopLeftRadius: 4 },
  doctorBubble: { backgroundColor: PRIMARY_BLUE, borderBottomRightRadius: 4 },

  msgText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: "#1E293B" },
  doctorText: { color: "white" },

  bubbleFiles: { marginBottom: 8 },
  fileTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  fileTagText: { color: "white", fontSize: 11, marginLeft: 4 },

  previewContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  previewName: {
    fontSize: 12,
    color: "#334155",
    maxWidth: 100,
    marginHorizontal: 6,
  },
  removeBtn: { padding: 2 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "white",
  },
  attachBtn: { marginRight: 10 },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendBtnDisabled: { backgroundColor: "#CBD5E1" },
});

// ==========================================
// 3. Upload Popup Styles (upload.jsx)
// ==========================================
export const uploadStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundClickable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popupCard: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  closeBtn: { padding: 5 },
  content: { padding: 15 },

  rowContainer: { flexDirection: "row", gap: 10, marginBottom: 15 },
  actionCard: {
    flex: 1,
    height: 100,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dashedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },

  selectionCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptyHint: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 13,
  },

  listContainer: { marginTop: 5 },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  fileName: { flex: 1, marginLeft: 8, fontSize: 13, color: "#333" },

  footer: { padding: 15, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  btn: {
    backgroundColor: PRIMARY_BLUE,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
