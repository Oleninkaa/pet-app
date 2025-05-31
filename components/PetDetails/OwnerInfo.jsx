import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OwnerInfo({ pet, initiateChat}) {
  console.log('\n\n\n', pet);
  if (pet) {
    console.log('\n\n\n -----------', pet.username);
  } else {
    console.log('Pet is undefined!');
  }
  return (
    <TouchableOpacity onPress={initiateChat} style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: pet?.userImage }} style={styles.image} />
        <View>
          <Text style={styles.name}>{pet.username}</Text>
          <Text style={styles.title}>Pet owner</Text>
        </View>
      </View>
      <Ionicons name="send-sharp" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: theme.colors.primary,
    padding: 20,
    backgroundColor: theme.colors.white,
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    objectFit: "cover",
  },
  name: {
    fontFamily: "montserrat-medium",
    fontSize: 17,
  },
  title: {
    fontFamily: "montserrat",
    color: theme.colors.grey,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    flexWrap: `wrap`,
    flex: 1,
  },
});
