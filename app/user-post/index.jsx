import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { theme } from "./../../constants/Colors";
import { query } from "firebase/database";
import { collection, deleteDoc, doc, getDocs, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import PetListItem from "../../components/Home/PetListItem";

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "User Post",
    });
    user && getUserPost();
  }, [user]);

  const getUserPost = async () => {
    setLoader(true);
    setUserPostList([]);
    const q = query(
      collection(db, "Pets"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setUserPostList((prev) => [...prev, { ...doc.data(), id: doc.id }]); // Додаємо id документа
    });
    setLoader(false);
  };

  const onDeletePost = (docId) => {
    Alert.alert("Delete post?", "Do you want to delete this post?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel delete"),
      },
      {
        text: "Delete",
        onPress: () => deletePost(docId),
      },
    ]);

    const deletePost = async (docId) => {
      await deleteDoc(doc(db, "Pets", docId));
      getUserPost();
    };
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>UserPost</Text>

      <FlatList
        data={userPostList}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper} // Додаємо відступи між колонками
        contentContainerStyle={styles.listContent} // Додаємо відступи зверху/знизу
        onRefresh={getUserPost} // Виправлено: передаємо функцію без виклику
        refreshing={loader}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <PetListItem pet={item} key={item.id} /> {/* Використовуємо item.id як ключ */}
            <Pressable
              style={styles.deleteButton}
              onPress={() => onDeletePost(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No post found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.spacing.large,
    flex: 1,
  },
  title: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: theme.spacing.large, 
  },
  listContent: {
    paddingBottom: theme.spacing.small,
  },

  deleteButton: {
    backgroundColor: theme.colors.light,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  deleteButtonText: {
    fontFamily: "inter-bold",
    textAlign: "center",
    color: theme.colors.accent,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: "inter",
    color: theme.colors.gray_light,
  },
});