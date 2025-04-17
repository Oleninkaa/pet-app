import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

export default function Header() {
  const { user } = useUser();
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.title}>Welcome,</Text>
        <Text style={styles.name}>{user?.fullName}</Text>
      </View>

      <Image source={{uri:user?.imageUrl}} style={styles.image}></Image>
    </View>
    
  );
}

const styles = StyleSheet.create({

    wrapper:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',   
        alignItems: 'center',
    },
  title: {
    fontFamily: "montserrat-bold",
    fontSize: 20,
  },

  name: {
    fontFamily: "montserrat-bold",
    fontSize: 25,
  },

  image:{
    width:40,
    height: 40,
    borderRadius: 20,
    
  }
});
