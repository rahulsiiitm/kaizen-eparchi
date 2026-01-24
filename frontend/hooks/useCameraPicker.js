import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export const useCameraPicker = () => {
  const [cameraFiles, setCameraFiles] = useState([]);

  const handleTakePicture = async () => {
    try {
      const { status: existingStatus } = await ImagePicker.getCameraPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission Required", "Camera access is needed to take photos.", [
          { text: "Settings", onPress: () => Linking.openSettings() },
        ]);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newPhoto = {
          uri: result.assets[0].uri,
          name: `Cam_${Date.now()}.jpg`,
          source: 'camera', // Identifier for deletion
          type: 'image/jpeg'
        };
        setCameraFiles((prev) => [...prev, newPhoto]);
      }
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  return { cameraFiles, setCameraFiles, handleTakePicture };
};