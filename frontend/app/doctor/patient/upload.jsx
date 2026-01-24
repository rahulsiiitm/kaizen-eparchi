import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system"; // 1. Import FileSystem

// Import your hooks
import { useCameraPicker } from "../../../hooks/useCameraPicker";
import { useFilePicker } from "../../../hooks/useFilePicker";

const PRIMARY_BLUE = "#007AFF";

export default function UploadScreen() {
  const { height } = useWindowDimensions();

  const { cameraFiles, setCameraFiles, handleTakePicture } = useCameraPicker();
  const { libraryFiles, setLibraryFiles, handlePickLibrary } = useFilePicker();

  const selectedFiles = [...libraryFiles, ...cameraFiles];

  // 2. Clear UI States
  const clearAll = () => {
    setCameraFiles([]);
    setLibraryFiles([]);
  };

  // 3. Clear Physical Cache
  const clearExpoCache = async () => {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (cacheDir) {
        const files = await FileSystem.readDirectoryAsync(cacheDir);
        const deletePromises = files.map((file) =>
          FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true })
        );
        await Promise.all(deletePromises);
        console.log("🧹 Physical cache cleared successfully.");
      }
    } catch (err) {
      console.error("❌ Cache cleanup error:", err);
    }
  };

  const handleContinue = async () => { // Made async
    if (selectedFiles.length === 0) {
      Alert.alert("Empty", "Please select at least one file.");
      return;
    }

    // 1. Snapshot and Log
    const uploadSnapshot = [...selectedFiles];
    console.log("==============================");
    console.log("🚀 UPLOAD PROCESS STARTED");
    console.log("📦 Total Files:", uploadSnapshot.length);
    console.log("📄 Details:", uploadSnapshot);
    console.log("==============================");

    // 2. Clear UI state
    clearAll();

    // 3. Clear the physical Expo cache
    await clearExpoCache();

    Alert.alert("Success", `${uploadSnapshot.length} files processed and cache cleared.`);
  };

  const getFileIcon = (item) => {
    const type = item.type || "";
    if (type.includes("image")) {
      return {
        name: item.source === "camera" ? "camera" : "image",
        color: item.source === "camera" ? "#27C93F" : PRIMARY_BLUE,
      };
    }
    if (type.includes("pdf")) {
      return { name: "document-text", color: "#FF3B30" };
    }
    return { name: "document-attach", color: "#9BA4B0" };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons
            name="cloud-upload-outline"
            size={24}
            color="black"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.headerTitle}>Upload Center</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={[styles.smallCard, { height: height * 0.2 }]}
            onPress={handlePickLibrary}
          >
            <View style={styles.dashedContainer}>
              <Ionicons
                name="documents-outline"
                size={32}
                color={PRIMARY_BLUE}
              />
              <Text style={styles.cardLabel}>Choose Files</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallCard, { height: height * 0.2 }]}
            onPress={handleTakePicture}
          >
            <View style={styles.dashedContainer}>
              <Ionicons name="camera-outline" size={32} color="#27C93F" />
              <Text style={styles.cardLabel}>Take Image</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.selectionCount}>
          Selection: {selectedFiles.length} files
        </Text>

        <View style={styles.listContainer}>
          {selectedFiles.map((item) => {
            const iconConfig = getFileIcon(item);
            return (
              <View key={item.uri} style={styles.fileRow}>
                <Ionicons
                  name={iconConfig.name}
                  size={18}
                  color={iconConfig.color}
                />
                <Text style={styles.fileName} numberOfLines={1}>
                  {item.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (item.source === "camera") {
                      setCameraFiles((prev) =>
                        prev.filter((f) => f.uri !== item.uri)
                      );
                    } else {
                      setLibraryFiles((prev) =>
                        prev.filter((f) => f.uri !== item.uri)
                      );
                    }
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, selectedFiles.length === 0 && { opacity: 0.5 }]}
          disabled={selectedFiles.length === 0}
          onPress={handleContinue}
        >
          <Text style={styles.btnText}>Continue ({selectedFiles.length})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  headerTitleContainer: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  content: { padding: 20 },
  rowContainer: { flexDirection: "row", gap: 15 },
  smallCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dashedContainer: {
    flex: 1,
    margin: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  selectionCount: {
    marginTop: 20,
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  listContainer: { marginTop: 15 },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    marginBottom: 8,
  },
  fileName: { flex: 1, marginLeft: 10, fontSize: 14, color: "#4B5563" },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  btn: {
    backgroundColor: PRIMARY_BLUE,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});