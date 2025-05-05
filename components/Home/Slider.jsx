import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { theme } from "./../../constants/Colors";

export default function Slider() {
  const [slidersList, setSlidersList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    getSliders();
  }, []);

  useEffect(() => {
    // Set up auto-scroll when slidersList is loaded
    if (slidersList.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slidersList.length;
        setCurrentIndex(nextIndex);
        
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [currentIndex, slidersList.length]);

  const getSliders = async () => {
    setSlidersList([]);
    const snapshot = await getDocs(collection(db, "Sliders"));
    const sliders = snapshot.docs.map((doc) => doc.data());
    setSlidersList(sliders);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slidersList}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: Dimensions.get("screen").width - theme.spacing.large * 2,
          offset: (Dimensions.get("screen").width - theme.spacing.large * 2) * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  slide: {
    width: Dimensions.get("screen").width - theme.spacing.large * 2,
    alignItems: "center",
  },
  image: {
    width: '100%',
    height: 170,
    borderRadius: 10,
  },
});