import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { theme } from "../../constants/Colors";

export default function Header() {
  const { user } = useUser();
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.title}>Welcome,</Text>
        <Text style={styles.name}>{user?.fullName}</Text>
      </View>

      <Image source={{ uri: user?.imageUrl }} style={styles.image}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.medium,
  },
  title: {
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray,
  },

  name: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.large,
    color: theme.colors.primary,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.circle,
    borderColor: theme.colors.gray_ultra_light,
    borderWidth: 1,
  },
});
