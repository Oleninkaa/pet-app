import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "../MarkFav";

export default function PetListItem({ pet }) {

  
  const router = useRouter();
  return (
    <>
      {!pet && (
        <View style={styles.container}>
          <Text style={styles.name}>No pets available</Text>
        </View>
      )}
      {pet && (
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            router.push({
              pathname: "/pet-details",
              params: pet,
            })
          }
        >
          <View style={styles.heart}>
            <MarkFav pet={pet} color={theme.colors.white} />
          </View>
          <Image source={{ uri: pet.imageUrl }} style={styles.image} />
          <Text style={styles.name}>{pet.name}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.breed}>{pet.breed}</Text>
            <Text style={styles.age}>{pet.age} yrs</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  image: {
    width: 150,
    height: 150,
    objectFit: "cover",
    borderRadius: 10,
    margin: "auto",
  },
  container: {
    padding: 10,
    marginRight: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
  name: {
    fontSize: 17,
    paddingTop: 5,
  },
  breed: {
    fontSize: 14,
    color: theme.colors.grey,
  },

  age: {
    fontSize: 14,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primary_light,
    padding: 5,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});