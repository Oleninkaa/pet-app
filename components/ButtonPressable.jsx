import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import { theme } from "../constants/Colors";

export default function ButtonPressable({text, pathname, params}) {
  return (
    <TouchableOpacity
    style={styles.body}
      onPress={() =>
        router.push({
          pathname: pathname,
          params: params
        })
      }
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body:{
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.normal,
    width: 170,
  },
  text:{
    fontFamily: 'inter-semiBold',
    color: theme.colors.white,
    fontSize: theme.fontSize.large,
    textAlign: 'center',
  },
});
