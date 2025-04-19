import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { SignOutButton } from "@/components/SignOutButton";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";

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
});
