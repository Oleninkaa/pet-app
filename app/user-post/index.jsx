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
      setUserPostList((prev) => [...prev, doc.data()]);
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
        onRefresh={() => getUserPost}
        refreshing={loader}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem pet={item} key={index} />
            <Pressable
              style={styles.deleteButton}
              onPress={() => onDeletePost(item?.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      {userPostList?.length == 0 && <Text>No post found</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  title: {
    fontFamily: "montserrat-medium",
    fontSize: 30,
  },
  deleteButton: {
    backgroundColor: theme.colors.primary_light,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 10,
  },
  deleteButtonText: {
    fontFamily: "montserrat",
    textAlign: "center",
  },
});
