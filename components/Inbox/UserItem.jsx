import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { Link } from "expo-router";

export default function UserItem({ userInfo }) {
  return (
    <Link href={"/chat?id=" + userInfo.docId}>
      <View style={styles.wrapper}>
        <Image
          source={{ uri: userInfo?.imageUrl }}
          style={styles.image}
        ></Image>
        <Text style={styles.userName}>{userInfo?.name}</Text>
      </View>


    </Link>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 7,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    width: `100%`,
    borderColor: theme.colors.gray_ultra_light,
    paddingVertical: theme.spacing.medium
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 99,
  },
  userName: {
    fontFamily: "montserrat-medium",
    fontSize: 20,
  },
  
});
