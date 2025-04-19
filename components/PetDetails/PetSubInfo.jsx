import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";
import PetSubInfoCard from "./PetSubInfoCard";

export default function PetSubInfo({ pet }) {
  return (
    <View style={styles.container}>
      <View style={styles.cardsGroup}>
        <PetSubInfoCard
          icon={require("./../../assets/images/calendar.png")}
          title={"Age"}
          value={pet?.age + (pet?.age == "1" ? " year" : " years")}
        />

        <PetSubInfoCard
          icon={require("./../../assets/images/bone.png")}
          title={"Breed"}
          value={pet?.breed}
        />
      </View>

      <View style={styles.cardsGroup}>
        <PetSubInfoCard
          icon={require("./../../assets/images/sex.png")}
          title={"Sex"}
          value={pet?.sex}
        />

        <PetSubInfoCard
          icon={require("./../../assets/images/weight.png")}
          title={"Weight"}
          value={pet?.weight + " kg"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
  ageText: {
    fontFamily: "montserrat-medium",
    color: theme.colors.gray,
    fontSize: 16,
  },
  ageValue: {
    fontFamily: "montserrat-medium",
    fontSize: 20,
  },
});
