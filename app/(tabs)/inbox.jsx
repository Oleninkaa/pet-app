import { View, Text, StyleSheet, FlatList, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { query } from "firebase/database";
import { collection, getDocs, where } from "firebase/firestore";
import { db } from "./../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { theme } from "./../../constants/Colors";
import UserItem from "../../components/Inbox/UserItem";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    user && getUserList();
  }, [user]);

  const getUserList = async () => {
    setLoader(true);
    const q = query(
      collection(db, "Chat"),
      where(
        "userIds",
        "array-contains",
        user?.primaryEmailAddress?.emailAddress
      )
    );

    const querySnapshot = await getDocs(q);
    const uniqueChats = [];
    querySnapshot.forEach((doc) => {
      const chatData = doc.data();
      // Перевірка на унікальність (наприклад, за `doc.id`)
      if (!uniqueChats.some(chat => chat.id === doc.id)) {
        uniqueChats.push({ ...chatData, id: doc.id });
      }
    });
    setUserList(uniqueChats); // Оновлюємо весь масив
    setLoader(false);
  };

  const mapOtherUserList = () => {
    return userList.map((record) => {
      const otherUser = record.users?.filter(
        (userItem) => userItem?.email !== user?.primaryEmailAddress?.emailAddress
      );
      return {
        docId: record.id,
        ...otherUser[0],
      };
    });
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.content}>Inbox</Text>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshing={loader}
        onRefresh={getUserList}
        data={mapOtherUserList()}
        renderItem={({ item }) => (
          <UserItem userInfo={item} key={item.docId} /> // Використовуємо docId як ключ
        )}
        ListEmptyComponent={
          !loader && (
            <View style={styles.emptyContainer}>
              <Image
                style={styles.emptyImage}
                source={require("./../../assets/images/no_emails.png")}
              />
              <Text style={styles.emptyTitle}>No messages</Text>
              <Text style={styles.emptyText}>
                You have nothing on your inbox yet. It`s never too late to change it!
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}



const styles = StyleSheet.create({
  wrapper: {
    padding: theme.spacing.large,
    flex: 1, // Add this to make wrapper take full height
  },
  content: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary_light,
    paddingBottom: theme.spacing.medium,
  },
  list: {
    flex: 1, // Add this to make FlatList take remaining space
  },
  listContent: {
    flexGrow: 1, // Add this to allow content to grow
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 150, // Adjust this value as needed

  },
  emptyTitle: {
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.large,
    color: theme.colors.accent,
  },
  emptyText: {
    marginTop: theme.spacing.small,
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray_ultra_light,
    textAlign: "center",
    maxWidth: 300,
  },
  emptyImage: {
    width: 200,
    height: 200,
    objectFit: "contain",
    marginBottom: theme.spacing.medium,
  }
});