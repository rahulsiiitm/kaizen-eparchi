import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useCameraPicker } from "../../../hooks/useCameraPicker";
import { useFilePicker } from "../../../hooks/useFilePicker";
import { uploadStyles as styles } from "../../../styles/patient_style";
// 👇 Import CustomAlert
import CustomAlert from "../../../components/custom_alert";

const PRIMARY_BLUE = "#007AFF";

if (!global.tempUploadFiles) global.tempUploadFiles = [];

export default function UploadPopup() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  // ⚡ DOC TYPE STATE
  const [docType, setDocType] = useState("prescription");
  // 👇 Custom Alert State
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const { cameraFiles, setCameraFiles, handleTakePicture } = useCameraPicker();
  const { libraryFiles, setLibraryFiles, handlePickLibrary } = useFilePicker();

  const selectedFiles = [...libraryFiles, ...cameraFiles];

  const handleContinue = () => {
    if (selectedFiles.length === 0) {
      setAlertConfig({
        visible: true,
        title: "Empty",
        message: "Please select at least one file.",
        type: "warning",
      });
      return;
    }
    // Tag files with the selected type
    const taggedFiles = selectedFiles.map((f) => ({ ...f, docType }));
    global.tempUploadFiles = taggedFiles;
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backgroundClickable} />
      </TouchableWithoutFeedback>

      <View style={[styles.popupCard, { height: height * 0.75 }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upload File</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* ⚡ TYPE SELECTOR BUTTONS */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: PRIMARY_BLUE,
                backgroundColor:
                  docType === "prescription" ? PRIMARY_BLUE : "white",
                alignItems: "center",
              }}
              onPress={() => setDocType("prescription")}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: docType === "prescription" ? "white" : PRIMARY_BLUE,
                }}
              >
                Rx Prescription
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: PRIMARY_BLUE,
                backgroundColor: docType === "xray" ? PRIMARY_BLUE : "white",
                alignItems: "center",
              }}
              onPress={() => setDocType("xray")}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: docType === "xray" ? "white" : PRIMARY_BLUE,
                }}
              >
                X-Ray Scan
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handlePickLibrary}
            >
              <View style={styles.dashedContainer}>
                <Ionicons
                  name="documents-outline"
                  size={28}
                  color={PRIMARY_BLUE}
                />
                <Text style={styles.cardLabel}>Choose File</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleTakePicture}
            >
              <View style={styles.dashedContainer}>
                <Ionicons name="camera-outline" size={28} color="#27C93F" />
                <Text style={styles.cardLabel}>Take Photo</Text>
              </View>
            </TouchableOpacity>
          </View>

          {selectedFiles.length > 0 ? (
            <View style={styles.listContainer}>
              <Text style={styles.selectionCount}>
                Selected ({selectedFiles.length})
              </Text>
              {selectedFiles.map((item) => (
                <View key={item.uri} style={styles.fileRow}>
                  <Ionicons
                    name="document-text"
                    size={16}
                    color={PRIMARY_BLUE}
                  />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.source === "camera") {
                        setCameraFiles((prev) =>
                          prev.filter((f) => f.uri !== item.uri),
                        );
                      } else {
                        setLibraryFiles((prev) =>
                          prev.filter((f) => f.uri !== item.uri),
                        );
                      }
                    }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyHint}>No files selected yet</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, selectedFiles.length === 0 && { opacity: 0.5 }]}
            disabled={selectedFiles.length === 0}
            onPress={handleContinue}
          >
            <Text style={styles.btnText}>
              Analyze as {docType === "xray" ? "X-Ray" : "Prescription"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 👇 Custom Alert Component */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </View>
  );
}
