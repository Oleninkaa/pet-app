import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../constants/Colors";

export default function InputField({
  value,
  onChangeText,
  secureTextEntry,
  placeholder,
  autoCapitalize,
  style,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={theme.colors.primary_light}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.normal,
    maxWidth: "100%",
    minWidth: "48%",
  },
  input: {
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.medium,
    paddingHorizontal: theme.spacing.small,
    color: theme.colors.primary,
  },
});
