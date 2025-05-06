import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../constants/Colors";
import MarkFav from "../MarkFav";

export default function ({ pet, customStyle }) {
  return (
    <View style={customStyle}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.petName}>{pet?.name}</Text>
          <Text 
            style={styles.petAddress}
            numberOfLines={2} // Дозволяємо 2 рядки
            ellipsizeMode="tail" // Троє крапок, якщо не вміщається
          >
            {pet?.address}
          </Text>
        </View>
        <MarkFav pet={pet} customFill={theme.colors.white} size={35}/>
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
    padding: theme.spacing.medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  textContainer: {
    flex: 1, // Займає весь доступний простір
    marginRight: 10, // Відступ від кнопки
  },
  petName: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary,
    marginBottom: 4, // Відступ між ім'ям та адресою
  },
  petAddress: {
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.primary_light,
    flexShrink: 1, // Дозволяє стискатись
    flexWrap: 'wrap', // Дозволяє переносити текст
    maxWidth: '90%', // Обмежує ширину для перенесення
  },
});