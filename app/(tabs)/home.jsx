import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { SignOutButton } from "@/components/SignOutButton";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
export default function HomeScreen() {
  return (
    <>
      <View style={styles.wrapper}>
        {/*Header*/}
        <Header />

        {/*Slider*/}
        <Slider />

        {/*Category + List of pets*/}
        <PetListByCategory />

        {/*Add new pet*/}
        <Link href={"./add-new-pet"} style={styles.addNewPet}>
          <MaterialIcons name="pets" size={24} color={theme.colors.primary} />
          <Text style={styles.newPetText}>Add new pet</Text>
        </Link>
      </View>

      <SignOutButton />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.spacing.small,
    margin: theme.spacing.small,
  },
  addNewPet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
    marginTop: 20,
    backgroundColor: theme.colors.primary_light,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 15,
    borderStyle: "dashed",
    textAlign: "center",
  },

  newPetText: {
    fontFamily: "montserrat",
    fontSize: 18,
    color: theme.colors.primary,
  },
});
