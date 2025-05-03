import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import { theme } from "../constants/Colors";

export default function ButtonPressable({ text, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.body, style]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.normal,
  },
  text: {
    fontFamily: "inter-semiBold",
    color: theme.colors.white,
    fontSize: theme.fontSize.large,
    textAlign: "center",
  },
});
