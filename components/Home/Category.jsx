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

export default function Category() {
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
      <Text style={styles.text}>Category</Text>

      <FlatList
        data={categoriesList}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.categories}
            onPress={() => setSelectedCategory(item.name)}
          >
            <View
              style={[
                styles.image_container,
                selectedCategory === item.name && styles.categorySelected,
              ]}
            >
              <Image source={{ uri: item?.imageUrl }} style={styles.image} />
            </View>
            <Text style={styles.imageText}>{item?.name}</Text>
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
    fontFamily: "montserrat",
    fontSize: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  image_container: {
    backgroundColor: theme.colors.primary_light,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },

  categories: {
    flex: 1,
  },

  imageText: {
    fontFamily: "montserrat",
    fontSize: 12,
    textAlign: "center",
  },
  categorySelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
});
