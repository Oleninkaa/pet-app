import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "../MarkFav";
import Foundation from "@expo/vector-icons/Foundation";

export default function PetListItem({ pet }) {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 40 - 16) / 2; // Розрахунок ширини картки

  return (
    <>
      {!pet && (
        <View style={styles.container}>
          <Text style={styles.name}>No pets available</Text>
        </View>
      )}
      {pet && (
        <TouchableOpacity
          style={[styles.container, { width: cardWidth }]}
          onPress={() =>
            router.push({
              pathname: "/pet-details",
              params: pet,
            })
          }
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: pet.imageUrl }} style={styles.image} />
            <View style={styles.heart}>
              <MarkFav pet={pet} color={theme.colors.gray_light} />
            </View>
          </View>

          <View style={styles.textContent}>
            <View style={styles.infoContainer}>
              <View style={styles.textWrapper}>
                <Text 
                  style={styles.breed}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {pet.breed}
                </Text>
                <Text style={styles.name} numberOfLines={1}>
                  {pet.name}
                </Text>
              </View>

              {pet?.sex && (
                <Foundation
                  style={[
                    styles.sex,
                    {
                      backgroundColor: theme.colors[`${pet.sex.toLowerCase()}_bg`],
                    },
                  ]}
                  name={`${pet.sex.toLowerCase()}-symbol`}
                  size={20}
                  color={theme.colors[pet.sex.toLowerCase()]}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderColor: theme.colors.gray_ultra_light,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    marginBottom: 16,
  },
  imageContainer: {
    height: 150, // Фіксована висота зображення
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  heart: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.circle,
    padding: 5,
    opacity: 0.8,
  },
  textContent: {
    padding: 12,
    flexGrow: 1, // Дозволяє розтягуватись вниз
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textWrapper: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: theme.fontSize.large,
    color: theme.colors.gray,
    fontFamily: "inter-semiBold",
    marginTop: 4,
  },
  breed: {
    fontSize: theme.fontSize.small,
    color: theme.colors.gray_ultra_light,
    fontFamily: "inter",
    textTransform: "uppercase",
    flexShrink: 1,
    minHeight: 30, // Мінімальна висота для двох рядків
  },
  sex: {
    padding: 5,
    minWidth: 30,
    height: 30,
    borderRadius: theme.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});