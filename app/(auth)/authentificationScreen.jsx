import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import React from "react";
import { Link } from "expo-router";

export default function AuthenticationScreen() {
  const { mode } = useLocalSearchParams(); // "sign-in" або "sign-up"
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

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      {mode === "sign-in" ? (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="Email"
            autoCapitalize="none"
            style={{ borderBottomWidth: 1, marginBottom: 12 }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />

          <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Text>Don't have an account?</Text>
            <Link href="/sign-up">
              <Text>Sign up</Text>
            </Link>
          </View>
          <TouchableOpacity
            onPress={handleSignIn}
            style={{ backgroundColor: "#000", padding: 10 }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Sign In</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
          {pendingVerification ? (
            <>
              <Text>We sent a code to your email</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Verification code"
                style={{ borderBottomWidth: 1, marginBottom: 20 }}
              />
              <TouchableOpacity
                onPress={handleVerify}
                style={{ backgroundColor: "#000", padding: 10 }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Verify
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="Email"
                autoCapitalize="none"
                style={{ borderBottomWidth: 1, marginBottom: 12 }}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={{ borderBottomWidth: 1, marginBottom: 20 }}
              />

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full name"
                secureTextEntry
                style={{ borderBottomWidth: 1, marginBottom: 20 }}
              />

              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                autoCapitalize="none"
                style={{ borderBottomWidth: 1, marginBottom: 12 }}
              />

              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                autoCapitalize="none"
                style={{ borderBottomWidth: 1, marginBottom: 12 }}
              />

              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="user name"
                autoCapitalize="none"
                style={{ borderBottomWidth: 1, marginBottom: 12 }}
              />

              <TouchableOpacity
                onPress={handleSignUp}
                style={{ backgroundColor: "#000", padding: 10 }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
}
