import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";
import PetSubInfoCard from "./PetSubInfoCard";

export default function PetSubInfo({ pet }) {
  return (
    <View style={styles.container}>
      <View style={styles.cardsGroup}>
        <PetSubInfoCard
          icon={require("./../../assets/images/icons/calendar.png")}
          title={"Age"}
          value={pet?.age + (pet?.age == "1" ? " year" : " years")}
        />

        <PetSubInfoCard
          icon={require("./../../assets/images/icons/bone.png")}
          title={"Breed"}
          value={pet?.breed}
        />
      </View>

      <View style={[styles.cardsGroup, { marginTop: theme.spacing.small }]}>
        <PetSubInfoCard
          icon={require("./../../assets/images/icons/gender-fluid.png")}
          title={"Sex"}
          value={pet?.sex}
        />

        <PetSubInfoCard
          icon={require("./../../assets/images/icons/weight.png")}
          title={"Weight"}
          value={pet?.weight + " kg"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingVertical: theme.spacing.medium,
  },
  image: {
    width: 40,
    height: 40,
  },
  cardsGroup: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing.small,
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
