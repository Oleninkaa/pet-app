import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";

export default function PetSubInfoCard({ icon, title, value }) {
  return (
    <View style={styles.card}>
      <Image source={icon} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value !== undefined ? value : ""}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: 40,
    height: 40,
  },
  cardsGroup: {
    display: "flex",
    flexDirection: "row",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: 10,
    margin: 5,
    borderRadius: 15,
    gap: 10,
    flex: 1,
  },
  title: {
    fontFamily: "montserrat-medium",
    color: theme.colors.gray,
    fontSize: 16,
  },
  value: {
    fontFamily: "montserrat-medium",
    fontSize: 18,
  },
});
