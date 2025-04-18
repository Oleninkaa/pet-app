import { View, Text, Image, StyleSheet, Pressable, Button, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect } from "react";
import { theme } from "./../../constants/Colors";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { SignOutButton } from "@/components/SignOutButton";

import * as WebBrowser from "expo-web-browser";
import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();

    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { user } = useUser();
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: Linking.createURL("./../(tabs)/home", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log(startSSOFlow.signIn);
      } else {
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log("Error starting SSO flow:", err);
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const [signInPressed, setsignInPressed] = React.useState(false);
  const [signUpPressed, setsignUpPressed] = React.useState(false);
  return (
    <View style={styles.wrapper}>
      <Image
        source={require("./../../assets/images/login-dog.jpg")}
        style={{ width: "100%", height: "500" }}
      ></Image>
      <View style={styles.containerText}>
        <View style={styles.content}>
          <Text style={styles.title}>Ready to make a new friend?</Text>
          <Text style={styles.text}>Lorem ipsum</Text>
        </View>
        <View>
          <SignedIn>
            <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
            <SignOutButton />
          </SignedIn>
          <SignedOut>
            <View style={styles.authOptions}>
              <View style={styles.sigbInUp}>
              <TouchableOpacity onPress={() => router.push({ pathname: "../(auth)/authentificationScreen", params: { mode: "sign-in" } })}>
    <Text>Sign in</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => router.push({ pathname: "../(auth)/authentificationScreen", params: { mode: "sign-up" } })}>
    <Text>Sign up</Text>
  </TouchableOpacity>
              </View>
              

              <TouchableOpacity onPress={onPress} style={styles.buttonGoogle}>
                <Image
                  source={require("./../../assets/images/google.png")} // заміни шлях на свій
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          </SignedOut>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.white,
    height: "100%",
    paddingBottom: theme.spacing.large,
  },

  containerText: {
    padding: theme.spacing.large,
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    rowGap: theme.spacing.large,
  },
  image: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 30,
  },
  content: {
    rowGap: theme.spacing.small,
  },

  title: {
    fontFamily: "montserrat-bold",
    fontSize: 30,
    textAlign: "center",
  },
  text: {
    fontFamily: "montserrat",
    fontSize: 18,
    textAlign: "center",
    color: theme.colors.gray,
  },

  buttonContainer: {
    padding: theme.spacing.medium,
    //marginTop:100,
    backgroundColor: theme.colors.primary,
    width: "100%",
    borderRadius: theme.spacing.medium,
  },

  button: {
    fontFamily: "montserrat-bold",
    fontSize: theme.spacing.large,
    textAlign: "center",
  },

  authOptions: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing.medium,
    gap: theme.spacing.large,
    //backgroundColor: "#4f4f4f",
  },

  sigbInUp: {
   fontSize: 42,
  },

  buttonGoogle: {
    width: 50,
    height: 50,
  },

  image: {
    width:"100%",
    height: "100%",
  },
});
