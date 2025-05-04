import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function EditAvatar() {
  const { user } = useUser(); // User is definitely authenticated
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatar = async () => {
    setIsUploading(true);

    try {
      // 1. Get image permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow photo access");
        return;
      }

      // 2. Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;

      // 3. Convert to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 4. Update profile image
      await user?.setProfileImage({
        file: `data:image/jpeg;base64,${base64}`,
      });

      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", error.message || "Update failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.avatarContainer}>
      <Image style={styles.image} source={{ uri: user?.imageUrl }} />
      <Pressable
        style={styles.uploadButton}
        onPress={uploadAvatar}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Ionicons name="camera" size={20} color="white" />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: theme.colors.gray_ultra_light,
  },
  uploadButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary_light,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});
