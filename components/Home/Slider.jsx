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

export default function Slider() {
  const [slidersList, setSlidersList] = useState([]);

  useEffect(() => {
    getSliders();
  }, []);

  const getSliders = async () => {
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
        renderItem={({ item }) => (
          <View style={styles.slide}>
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
    paddingVertical: 20,
  },
  slide: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  image: {
    width: Dimensions.get("screen").width * 0.9,
    height: 200,
    borderRadius: 10,
  },
});
