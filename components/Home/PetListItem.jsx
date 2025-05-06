import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "../MarkFav";
import Foundation from "@expo/vector-icons/Foundation";

export default function PetListItem({ pet }) {
  const router = useRouter();

  const handleMultiLike = async () => {
    if (selectedPets.length === 0) return;
  
    try {
      // Отримуємо поточний список улюблених
      const currentFavs = await Shared.getFavList(user);
      const currentFavList = currentFavs?.favourites || [];
      
      // Створюємо новий список без дублікатів
      const updatedFavList = [...new Set([...currentFavList, ...selectedPets])];
      
      // Оновлюємо на сервері
      await Shared.updateFav(user, updatedFavList);
      
      // Оновлюємо локальний стан
      setSelectedPets([]);
      setIsMultiLikeMode(false);
      // Можна оновити список тварин
      getPetList(currentCategory); 
    } catch (error) {
      console.error("Multi-like failed:", error);
    }
  };
  
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
          <View style={styles.imageContainer}>
            <View style={styles.heart}>
              <MarkFav pet={pet} color={theme.colors.gray_light} />
            </View>
            <Image source={{ uri: pet.imageUrl }} style={styles.image} />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoText}>
              <Text style={styles.breed}>{pet.breed}</Text>
              <Text style={styles.name}>{pet.name}</Text>
            </View>

            {pet?.sex && (
              <Foundation
                style={[
                  styles.sex,
                  {
                    backgroundColor:
                      theme.colors[`${pet.sex.toLowerCase()}_bg`],
                  },
                ]}
                name={`${pet.sex.toLowerCase()}-symbol`}
                size={20}
                color={theme.colors[pet.sex.toLowerCase()]}
              />
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    margin: "auto",
  },

  imageContainer: {
    width: 170,
    height: 150,
  },
  container: {
    
    overflow: "hidden",
    //marginRight: 10,
    borderColor: theme.colors.gray_ultra_light,
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontSize: theme.fontSize.large,
    color: theme.colors.gray,
    fontFamily: "inter-semiBold",
  },
  breed: {
    fontSize: theme.fontSize.small,
    color: theme.colors.gray_ultra_light,
    fontFamily: "inter",
    textTransform: "uppercase",
    flexWrap: "wrap",
  },

  sex: {
    padding: 5,
    width: 30,
    height: 30,
    borderRadius: theme.borderRadius.circle,
    textAlign: "center",
    marginVertical: "auto",
  },
  infoContainer: {
    padding: theme.spacing.xSmall,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    gap: theme.spacing.xSmall,
    flexWrap: "wrap",
  },
  infoText: {
    flex: 1,
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
});
