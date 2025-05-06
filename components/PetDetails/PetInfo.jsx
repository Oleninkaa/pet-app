import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";
import MarkFav from "../MarkFav";

export default function ({ pet, customStyle }) {
 

  return (
    <View style = {customStyle}>
     
      <View style={styles.content}>
        <View>
          <Text style={styles.petName}>{pet?.name}</Text>
          <Text style={styles.petAddress}>{pet?.address}</Text>
        </View>
        <MarkFav pet={pet} customFill={theme.colors.light} size={35}/>
      </View>
    </View>
  );
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
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary,
  },
  petAddress: {
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.primary_light,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});
