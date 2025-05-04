import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { theme } from "./../../constants/Colors";

export default function Slider() {
  const [slidersList, setSlidersList] = useState([]);

  useEffect(() => {
    getSliders();
  }, []);

  const getSliders = async () => {
    setSlidersList([]);
    const snapshot = await getDocs(collection(db, "Sliders"));
    const sliders = snapshot.docs.map((doc) => doc.data());
    setSlidersList(sliders);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slidersList}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={(
          { item, index } // Add index to destructure
        ) => (
          <View
            style={[
              styles.slide,
              index === slidersList.length - 1 && { paddingRight: 0 }, // Use slidersList instead of data
            ]}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
  },
  slide: {
    alignItems: "center",
    paddingRight: theme.spacing.small,
  },
  image: {
    width: Dimensions.get("screen").width - theme.spacing.large * 2,
    height: 170,
    borderRadius: 10,
    objectFit: "cover",
  },
});
