import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";

import { theme } from "../../constants/Colors";

export default function AboutPet({ pet }) {
  const [readMore, setReadMore] = useState(true);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About {pet?.name}</Text>
      <Text numberOfLines={readMore ? 3 : 20} style={styles.text}>
        {pet?.about}
      </Text>
      {readMore && (
        <Pressable onPress={() => setReadMore(false)}>
          <Text style={styles.readMore}>{"Read more"}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: "montserrat-medium",
    fontSize: 20,
  },
  text: {
    fontFamily: "montserrat",
    fontSize: 14,
  },
  readMore: {
    fontFamily: "montserrat-medium",
    fontSize: 14,
    color: theme.colors.accent,
  },
});
