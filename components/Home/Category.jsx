import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { theme } from "./../../constants/Colors";

export default function Category({ category }) {
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Dogs");
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category"));
    const categories = snapshot.docs.map((doc) => doc.data());
    setCategoriesList(categories);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>Categories</Text>

      <FlatList
        data={categoriesList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.categories}
            onPress={() => {
              setSelectedCategory(item.name);
              category(item.name);
            }}
          >
            <View
              style={[
                styles.image_container,
                selectedCategory === item.name && styles.categorySelected,
              ]}
            >
              <Image source={{ uri: item?.imageUrl }} style={styles.image} />
              <Text
                style={[
                  styles.imageText,
                  selectedCategory === item.name && styles.imageTextSelected,
                ]}
              >
                {item?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: theme.spacing.small,
  },

  text: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.large,
    color: theme.colors.gray,
    paddingVertical: theme.spacing.xSmall,
  },
  image: {
    width: 80,
    height: 120,
  },
  image_container: {
    overflow: "hidden",
    borderRadius: 10,
    margin: 5,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    position: "relative",
  },

  categories: {
    flex: 1,
  },

  imageText: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.medium,
    color: theme.colors.white,
    textAlign: "center",
    position: "absolute",
    top: theme.spacing.xSmall,
    transform: [{ translateX: -0.5 }],
    width: "100%",
  },
  categorySelected: {
    borderColor: theme.colors.gray,
  },
  imageTextSelected: {
    color: theme.colors.gray,
  },
});
