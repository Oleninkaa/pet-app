import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import React from "react";
import { Link } from "expo-router";
import InputField from "../../components/InputField";
import { theme } from "../../constants/Colors";
import ButtonPressable from "../../components/ButtonPressable";
import OtpInput from "../../components/OtpInput";

export default function AuthenticationScreen() {
  const { mode } = useLocalSearchParams(); // "sign-in" or "sign-up"
  const router = useRouter();

  const signInState = useSignIn();
  const signUpState = useSignUp();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isResending, setIsResending] = React.useState(false);

  const handleSignIn = async () => {
    if (!signInState.isLoaded) return;
    try {
      const attempt = await signInState.signIn.create({
        identifier: emailAddress,
        password,
      });

      if (attempt.status === "complete") {
        await signInState.setActive({ session: attempt.createdSessionId });
        router.replace("./../(tabs)/home");
      } else {
        console.warn("Further steps required:", attempt);
      }
    } catch (err) {
      console.error("Sign in error:", JSON.stringify(err, null, 2));
    }
  };

  const handleSignUp = async () => {
    if (!signUpState.isLoaded) return;
    try {
      await signUpState.signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        username,
        fullName,
      });

      await signUpState.signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
    }
  };

  const handleVerify = async () => {
    if (!signUpState.isLoaded) return;
    try {
      if (!code) {
        console.error("Verification code is required");
        return;
      }

      const attempt = await signUpState.signUp.attemptEmailAddressVerification({
        code,
      });

      if (attempt.status === "complete") {
        await signUpState.setActive({ session: attempt.createdSessionId });
        router.replace("./../(tabs)/home");
      } else {
        console.warn("Verification incomplete:", attempt);
      }
    } catch (err) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
    }
  };

  const handleResendCode = async () => {
    if (!signUpState.isLoaded) return;
    try {
      setIsResending(true);
      await signUpState.signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      // Optional: Show a success message to the user
      alert("Verification code resent successfully!");
    } catch (err) {
      console.error("Resend error:", JSON.stringify(err, null, 2));
      alert("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const onOtpSubmit = (otp) => {
    setCode(otp);
  };

  return (
    <View style={styles.wrapper}>
      {mode === "sign-in" ? (
        <>
          <Text style={styles.title}>Login</Text>
          <View style={styles.inputsGroup}>
            <InputField
              value={emailAddress}
              onChangeText={setEmailAddress}
              secureTextEntry={false}
              placeholder={"Email"}
              autoCapitalize="none"
            />

            <InputField
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder={"Password"}
              autoCapitalize="none"
            />
          </View>

          <ButtonPressable text={"Login"} onPress={handleSignIn} />

          <View style={styles.routing}>
            <Text style={styles.routingText}>Don't have an account?</Text>
            <Link
              href={{
                pathname: "../(auth)/authentificationScreen",
                params: { mode: "sign-up" },
              }}
              style={styles.routingLink}
              asChild
            >
              <Text style={styles.routingLinkText}>Sign up</Text>
            </Link>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Sign Up</Text>

          {pendingVerification ? (
            <>
              <Text style={styles.verificationText}>
                We sent a code to {emailAddress || "your email."}
              </Text>

              <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
              <ButtonPressable
                text={"Continue"}
                onPress={handleVerify}
                disabled={!code}
              />

              <View style={styles.routing}>
                <Text style={styles.routingText}>
                  You didn't receive the code?
                </Text>
                <Pressable onPress={handleResendCode} disabled={isResending}>
                  <Text
                    style={[
                      styles.routingLinkText,
                      isResending && styles.disabledText,
                    ]}
                  >
                    {isResending ? "Sending..." : "Resend"}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputsGroup}>
                <InputField
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  secureTextEntry={false}
                  placeholder={"Email"}
                  autoCapitalize="none"
                />

                <InputField
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  placeholder={"Password"}
                  autoCapitalize="none"
                />

                <InputField
                  value={username}
                  onChangeText={setUsername}
                  secureTextEntry={false}
                  placeholder={"Username"}
                  autoCapitalize="none"
                />

                <View style={styles.fullName}>
                  <InputField
                    value={firstName}
                    onChangeText={setFirstName}
                    secureTextEntry={false}
                    placeholder={"First name"}
                    autoCapitalize="none"
                  />

                  <InputField
                    value={lastName}
                    onChangeText={setLastName}
                    secureTextEntry={false}
                    placeholder={"Last name"}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <ButtonPressable text={"Sign Up"} onPress={handleSignUp} />
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.spacing.xLarge,
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.white,
    gap: theme.spacing.xLarge,
  },

  title: {
    fontFamily: "inter-bold",
    color: theme.colors.primary,
    fontSize: theme.fontSize.xlarge,
  },
  inputsGroup: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.medium,
  },

  routing: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
  },

  routingText: {
    fontFamily: "inter",
    color: theme.colors.gray_light,
    fontSize: theme.fontSize.medium,
  },
  routingLinkText: {
    fontFamily: "inter-bold",
    color: theme.colors.gray_light,
    fontSize: theme.fontSize.medium,
  },
  disabledText: {
    opacity: 0.5,
  },
  fullName: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  verificationText: {
    fontFamily: "inter",
    color: theme.colors.gray_light,
    fontSize: theme.fontSize.medium,
  },
});
