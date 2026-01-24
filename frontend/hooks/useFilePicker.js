import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export const useFilePicker = () => {
  const [libraryFiles, setLibraryFiles] = useState([]);

  const handlePickLibrary = async () => {
    try {
      // 1. Open the Document Picker to allow images, PDFs, and docs
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map((asset, index) => ({
          uri: asset.uri,
          // Fallback naming logic remains consistent with your original code
          name: asset.name || asset.fileName || `File_${Date.now()}_${index}`,
          source: 'library', 
          // Dynamically detect mimeType or default to octet-stream for docs
          type: asset.mimeType || 'application/octet-stream'
        }));

        setLibraryFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (err) {
      console.error("Picker Error:", err);
    }
  };

  // Logic and Return types remain identical to prevent breaking your app
  return { libraryFiles, setLibraryFiles, handlePickLibrary };
};