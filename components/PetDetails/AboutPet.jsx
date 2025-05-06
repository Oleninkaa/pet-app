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
    paddingVertical: theme.spacing.medium,
  },
  title: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.large,
    color: theme.colors.primary_light,
  },
  text: {
    marginTop: theme.spacing.xSmall,
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray_light,
  },
  readMore: {
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.medium,
    color: theme.colors.accent,
  },
});
