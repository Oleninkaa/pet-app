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

      <View style={styles.line}></View>
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
  line: { borderWidth: 0.2, marginVertical: 7, borderColor: theme.colors.gray },
});
