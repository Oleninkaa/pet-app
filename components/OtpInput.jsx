import { View, TextInput, StyleSheet } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { theme } from "../constants/Colors";

export default function OtpInput({ length = 6, onOtpSubmit }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, text) => {
    if (isNaN(text)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input if text is entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Submit OTP if all fields are filled
    if (newOtp.every((num) => num !== "") && onOtpSubmit) {
      onOtpSubmit(newOtp.join(""));
    }
  };

  const handleKeyPress = (index, { nativeEvent: { key } }) => {
    // Handle backspace to focus previous input
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(input) => (inputRefs.current[index] = input)}
          value={value}
          onChangeText={(text) => handleChange(index, text)} // ✅ Fixed: Uses `text` directly
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          onKeyPress={(e) => handleKeyPress(index, e)}
          style={[styles.input, focusedIndex === index && styles.inputFocused]}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray_ultra_light,
    textAlign: "center",
    margin: theme.spacing.xSmall,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.normal,
    fontSize: theme.fontSize.medium,
  },
  inputFocused: {
    borderColor: theme.colors.accent,
  },
});
