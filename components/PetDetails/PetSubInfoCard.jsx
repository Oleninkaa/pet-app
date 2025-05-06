import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";

export default function PetSubInfoCard({ icon, title, value }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
      <Image source={icon} style={styles.image} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value !== undefined ? value : ""}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  imageContainer:{
    backgroundColor: theme.colors.light,
    width: 40,
    height: 40,
    padding: 5,
    borderRadius: theme.borderRadius.normal
  },
  image: {
    width:'100%',
    height: '100%',
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

    
    borderRadius: 15,
    gap: 10,
    flex: 1,

  },
  title: {
    fontFamily: "inter",
    color: theme.colors.gray_ultra_light,
    fontSize: theme.fontSize.small,
  },
  value: {
    fontFamily: "inter-semiBold",
    color: theme.colors.primary,
    fontSize: theme.fontSize.medium,
    flex:1
  },
});
