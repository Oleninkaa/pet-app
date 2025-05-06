import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  useWindowDimensions,
  ScrollView

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
  const { width } = useWindowDimensions();

  const cardWidth = (width - theme.spacing.large * 2 - theme.spacing.medium) / 2;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Your Posts",
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
      setUserPostList((prev) => [...prev, { ...doc.data(), id: doc.id }]);
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
    <ScrollView style={styles.wrapper}>
      <Text style={styles.title}>Your Posts</Text>

      <FlatList
        data={userPostList}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        onRefresh={getUserPost}
        refreshing={loader}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { width: cardWidth }]}>
            <PetListItem pet={item} />
            <Pressable
              style={styles.deleteButton}
              onPress={() => onDeletePost(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts found</Text>
          </View>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.large,
    color: theme.colors.primary,
    marginBottom: theme.spacing.large,
    paddingHorizontal: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap:  theme.spacing.medium,
  },
  listContent: {
    paddingBottom: theme.spacing.large,
  },
  itemContainer: {
    marginBottom:  theme.spacing.medium,
  },
  deleteButton: {
    backgroundColor: theme.colors.light,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: "inter-bold",
    color: theme.colors.accent,
    fontSize: theme.fontSize.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: "inter-medium",
    color: theme.colors.gray_light,
    fontSize: theme.fontSize.large,
  },
});