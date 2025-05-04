import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";

import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
export default function HomeScreen() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <Slider />
        <PetListByCategory customStyle={styles.customStyle} />
        <Link
          href={"../add-new-pet"}
          style={{ marginHorizontal: "auto", marginTop: theme.spacing.large }}
        >
          <View style={styles.addNewPet}>
            <Entypo name="plus" size={30} color={theme.colors.accent} />
            <Text style={styles.newPetText}>Add new pet</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customStyle: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing.medium,
  },
  wrapper: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.large,
  },

  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  // addNewPet: {
  //   display: "flex",
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: 10,
  //   padding: 20,
  //   marginTop: 20,
  //   backgroundColor: theme.colors.primary_light,
  //   borderWidth: 1,
  //   borderColor: theme.colors.primary,
  //   borderRadius: 15,
  //   borderStyle: "dashed",
  //   textAlign: "center",
  // },

  // newPetText: {
  //   fontFamily: "montserrat",
  //   fontSize: 18,
  //   color: theme.colors.primary,
  // },

  addNewPet: {
    backgroundColor: theme.colors.light,
    padding: theme.spacing.medium,
    borderRadius: 40,
    borderColor: theme.colors.accent,
    borderWidth: 2,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xSmall,
    width: 250,
  },
  newPetText: {
    fontFamily: "inter-bold",
    color: theme.colors.accent,
    fontSize: theme.fontSize.large,
    textAlign: "center",
  },
});
