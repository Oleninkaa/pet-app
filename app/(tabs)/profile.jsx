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
import { theme } from "./../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import EditAvatar from "../../components/EditAvatar";
import { useAuth } from "@clerk/clerk-expo";

export default function Profile() {
  const { user } = useUser(); // User is definitely authenticated
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("../login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const Menu = [
    { id: 1, name: "Add New Pet", icon: "add-circle", path: "/add-new-pet" },
    { id: 2, name: "Favorites", icon: "heart", path: "/(tabs)/favourite" },
    { id: 3, name: "Inbox", icon: "chatbubble", path: "/(tabs)/inbox" },
    { id: 4, name: "My Post", icon: "bookmark", path: "/user-post" },
    { id: 5, name: "Take a test", icon: "document", path: "/(test)" },
    { id: 6, name: "Logout", icon: "exit", path: "logout" },
  ];

  const onPressMenu = (menu) => {
    if (menu.name === "Logout") {
      handleSignOut();
      return;
    }
    router.push(menu.path);
  };

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
    <View style={styles.wrapper}>
      <Text style={styles.content}>Profile</Text>

      <View style={styles.container}>
        <EditAvatar />

        <Text style={styles.fullName}>{user?.fullName}</Text>
        <Text style={styles.username}>{["@", user?.username]}</Text>
        <View style={styles.emailContainer}>
          <Ionicons
            name="mail"
            size={24}
            color={theme.colors.gray_ultra_light}
          />
          <Text style={styles.email}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </View>

      <FlatList
        data={Menu}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listIcons}
            onPress={() => onPressMenu(item)}
          >
            <Ionicons
              name={item.icon}
              size={30}
              color={theme.colors.accent}
              style={styles.icon}
            />
            <Text style={styles.iconName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: theme.spacing.large
 
  },
  content: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary_light,

  },
  container: {
    alignItems: "center",
    marginVertical: 25,
    gap: 7,
  },

  fullName: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary_light,
  },
  email: {
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray_ultra_light,
  },
  emailContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xSmall,
  },

  username: {
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray_ultra_light,
  },
  listIcons: {
    marginVertical: theme.spacing.xSmall,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: theme.borderRadius.normal,
  },
  icon: {
    padding: 10,
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.circle,
  },
  iconName: {
    fontFamily: "inter",
    fontSize: theme.fontSize.large,
    color: theme.colors.gray_light,
  },
});
