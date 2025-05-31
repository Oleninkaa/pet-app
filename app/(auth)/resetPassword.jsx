import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import InputField from "../../components/InputField";
import ButtonPressable from "../../components/ButtonPressable";
import { theme } from "../../constants/Colors";

export default function PasswordResetScreen() {
  const router = useRouter();
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState("request");
  const [resetAttempted, setResetAttempted] = useState(false);

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (resetAttempted) {
      Alert.alert(
        "Error",
        "Reset already requested. Check your email for the code."
      );
      return;
    }

    setLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setResetAttempted(true);
      setActiveStep("verify");
    } catch (err) {
      console.error("Error:", err);
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage ||
          "Failed to send reset email. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit verification code");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        Alert.alert("Success", "Password reset successfully!");
        router.replace("./../(tabs)/home");
      }
    } catch (err) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.longMessage ||
          "Invalid verification code. Please check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Reset</Text>

      {activeStep === "request" && (
        <View style={styles.form}>
          <InputField
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <ButtonPressable
            text={resetAttempted ? "Resend reset link" : "Send reset link"}
            onPress={handleRequestReset}
            loading={loading}
          />
        </View>
      )}

      {activeStep === "verify" && (
        <>
          <Text style={styles.instructions}>
            Enter the verification code sent to {email}
          </Text>
          <View style={styles.form}>
            <InputField
              placeholder="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <InputField
              placeholder="New password (min 8 characters)"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <ButtonPressable
              text="Reset Password"
              onPress={handleVerifyCode}
              loading={loading}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontFamily: "inter-bold",
    color: theme.colors.primary,
    fontSize: theme.fontSize.xlarge,
    marginBottom: theme.spacing.xLarge,
  },
  instructions: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  form: {
    gap: theme.spacing.large,
  },
});
