import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PetInfo({ pet }) {
  return (
    <View>
      <Image source={{ uri: pet?.imageUrl }} style={styles.image}></Image>
      <View style={styles.content}>
        <View>
          <Text style={styles.petName}>{pet?.name}</Text>
          <Text style={styles.petAddress}>{pet?.address}</Text>
        </View>

        <Ionicons name="heart-outline" size={30} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 400,
    objectFit: "cover",
  },
  content: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  petName: {
    fontFamily: "montserrat-bold",
    fontSize: 27,
  },
  petAddress: {
    fontFamily: "montserrat",
    fontSize: 16,
    color: theme.colors.gray,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});
