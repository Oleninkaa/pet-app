import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { theme } from "./../../constants/Colors";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { SignOutButton } from "@/components/SignOutButton";

import * as WebBrowser from "expo-web-browser";
import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import ButtonPressable from "../../components/ButtonPressable";

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
          redirectUrl: Linking.createURL("./../(tabs)/home", {
            scheme: "myapp",
          }),
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
        <View style={styles.decoration}></View>
        <View style={styles.content}>
          <Text style={styles.title}>
            Ready to make a new{" "}
            <Text style={{ color: theme.colors.primary_light }}>friend</Text>?
          </Text>

          <Text style={styles.text}>Lorem ipsum</Text>
        </View>
        <View padding={styles.buttons}>
          <SignedIn>
            <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
            <SignOutButton />
          </SignedIn>
          <SignedOut>
            <View style={styles.authOptions}>
              <ButtonPressable
                text={"Login"}
                pathname={"../(auth)/authentificationScreen"}
                params={{ mode: "sign-in" }}
              />

              <ButtonPressable
                text={"Sign Up"}
                pathname={"../(auth)/authentificationScreen"}
                params={{ mode: "sign-up" }}
              />
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
  },

  containerText: {
    marginTop: theme.spacing.large,
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    rowGap: theme.spacing.large,
    backgroundColor: theme.colors.light,
  },

  content: {
    rowGap: theme.spacing.small,
    padding: theme.spacing.xSmall,
  },

  title: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary,
  },
  text: {
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray,
  },

  authOptions: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing.small,
    gap: theme.spacing.medium,
    paddingBottom: theme.spacing.large,
    marginBottom: theme.spacing.large,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  decoration: {
    backgroundColor: theme.colors.light,
    width: "110%",
    height: 100,
    borderRadius: theme.borderRadius.figure,
    margin: -50,
    position: "absolute",
  },
});
