import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";
import MarkFav from "../MarkFav";

export default function PetInfo({ pet }) {
  const fixedUrl = fixFirebaseUrl(pet.imageUrl);

  return (
    <View>
      <Image source={{ uri: fixedUrl }} style={styles.image}></Image>
      <View style={styles.content}>
        <View>
          <Text style={styles.petName}>{pet?.name}</Text>
          <Text style={styles.petAddress}>{pet?.address}</Text>
        </View>
        <MarkFav pet={pet} />
      </View>
    </View>
  );
}

function fixFirebaseUrl(url) {
  const parts = url.split("/o/");
  if (parts.length < 2) return url;
  const [prefix, rest] = parts;
  const [path, query] = rest.split("?");
  const encodedPath = encodeURIComponent(path);
  return `${prefix}/o/${encodedPath}?${query}`;
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
