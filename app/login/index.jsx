import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Button,
  TouchableOpacity,
  ScrollView
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
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { user } = useUser();
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("./../(tabs)/home", {
          scheme: "myapp",
        }),
      });

      if (createdSessionId) {
        console.log(startSSOFlow.signIn);
      }
    } catch (err) {
      console.log("Error starting SSO flow:", err);
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const [signInPressed, setsignInPressed] = React.useState(false);
  const [signUpPressed, setsignUpPressed] = React.useState(false);
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.wrapper}>
        <Image
          source={require("./../../assets/images/login-dog.jpg")}
          style={styles.image}
        />
        
        <View style={styles.mainContent}>
          <View style={styles.decoration}></View>
          
          <View style={styles.textContainer}>
            <View style={styles.content}>
              <Text style={styles.title}>
                Ready to make a new{" "}
                <Text style={{ color: theme.colors.primary_light }}>friend</Text>?
              </Text>
              
            </View>
            
            <View style={styles.buttons}>
              
              <SignedOut>
                <View style={styles.authOptions}>
                  <ButtonPressable
                    style={styles.button}
                    text={"Login"}
                    onPress={() =>
                      router.push({
                        pathname: "../(auth)/authentificationScreen",
                        params: { mode: "sign-in" },
                      })
                    }
                  />

                  <ButtonPressable
                    style={styles.button}
                    text={"Sign Up"}
                    onPress={() =>
                      router.push({
                        pathname: "../(auth)/authentificationScreen",
                        params: { mode: "sign-up" },
                      })
                    }
                  />
                </View>
              </SignedOut>
            </View>
          </View>
        </View>
        
        {/* Додатковий відступ внизу */}
        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  wrapper: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  image: {
    width: "100%",
    height: 500,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
    marginTop: -50,
    backgroundColor: theme.colors.light,
  },
  decoration: {
    backgroundColor: theme.colors.light,
    width: "110%",
    height: 100,
    borderRadius: theme.borderRadius.figure,
    position: "absolute",
    top: -50,
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: theme.spacing.xxLarge,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xxLarge,
  },
  content: {
    rowGap: theme.spacing.small,
    marginBottom: theme.spacing.large,
   
  },
  title: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  text: {
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  authOptions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
    gap: theme.spacing.medium,
    marginTop: theme.spacing.large,
    flexWrap: "wrap",
  },
  button: {
    width: 170,
    
  },
  buttons: {
    marginTop: 'auto',
    marginBottom: theme.spacing.small,
  },

});