import { View, Text, StyleSheet, Pressable, LayoutChangeEvent } from "react-native";
import React, { useState, useRef } from "react";
import { theme } from "../../constants/Colors";

export default function AboutPet({ pet }) {
  const [readMore, setReadMore] = useState(true);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef(null);
  const [textHeight, setTextHeight] = useState(0);

  const handleTextLayout = (event) => {
    const height = event.nativeEvent.layout.height;
    setTextHeight(height);
    
    // Якщо висота тексту більше 3 рядків (приблизно 60px)
    if (height > 60) {
      setShowReadMore(true);
    } else {
      setShowReadMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About {pet?.name}</Text>
      <Text 
        ref={textRef}
        numberOfLines={readMore ? 3 : undefined}
        style={styles.text}
        onLayout={handleTextLayout}
      >
        {pet?.about}
      </Text>
      {showReadMore && readMore && (
        <Pressable onPress={() => setReadMore(false)}>
          <Text style={styles.readMore}>{"Read more"}</Text>
        </Pressable>
      )}
      {!readMore && (
        <Pressable onPress={() => setReadMore(true)}>
          <Text style={styles.readMore}>{"Read less"}</Text>
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
    marginTop: 4,
  },
});