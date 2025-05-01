import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { useUser, useClerk } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-react";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();

  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("../login");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const Menu = [
    {
      id: 1,
      name: "Add New Pet",
      icon: "add-circle",
      path: "/add-new-pet",
    },
    {
      id: 2,
      name: "Favoutites",
      icon: "heart",
      path: "/(tabs)/favourite",
    },
    {
      id: 3,
      name: "Inbox",
      icon: "chatbubble",
      path: "/(tabs)/inbox",
    },
    {
      id: 4,
      name: "Logout",
      icon: "exit",
      path: "logout",
    },
    {
      id: 5,
      name: "My Post",
      icon: "bookmark",
      path: "/user-post",
    },
  ];

  const onPressMenu = (menu) => {
    console.log(menu.name);
    if (menu.name == "Logout") {
      handleSignOut();
      return;
    }
    router.push(menu.path);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.content}>Profile</Text>
      <View style={styles.container}>
        <Image source={{ uri: user?.imageUrl }} style={styles.image} />
        <Text style={styles.fullName}>{user?.fullName}</Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <FlatList
        data={Menu}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            style={styles.listIcons}
            key={index}
          >
            <Ionicons
              name={item?.icon}
              size={30}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text style={styles.iconName}>{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    marginTop: 20,
  },
  content: {
    fontFamily: "montserrat-medium",
    fontSize: 30,
  },
  container: {
    display: "flex",
    alignItems: "center",
    marginVertical: 25,
    gap: 7,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 90,
  },
  fullName: {
    fontFamily: "montserrat-bold",
    fontSize: 20,
  },
  email: {
    fontFamily: "montserrat",
    fontSize: 16,
    color: theme.colors.gray,
  },
  listIcons: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,
  },
  icon: {
    padding: 10,
    backgroundColor: theme.colors.primary_light,
    borderRadius: 10,
  },
  iconName: {
    fontFamily: "montserrat",
    fontSize: 20,
  },
});
