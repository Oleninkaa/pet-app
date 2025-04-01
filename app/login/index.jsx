import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";

export default function LoginScreen() {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require("./../../assets/images/login-dog.jpg")}
        style={{ width: "100%", height: "500" }}
      ></Image>
      <View style={styles.containerText}>
        <View style={styles.content}>
          <Text style={styles.title}>Ready to make a new friend?</Text>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit
            voluptas doloremque recusandae dolorem,{" "}
          </Text>
        </View>

        <Pressable style={styles.buttonContainer}>
          <Text style={styles.button}>Get Started</Text>
        </Pressable>
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
});
