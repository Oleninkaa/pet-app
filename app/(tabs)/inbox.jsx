import { View, Text, StyleSheet, FlatList, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
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

  const checkUserExists = async (email) => {
    try {
      const userRef = doc(db, "Users", email);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  const getUserList = async () => {
    setLoader(true);
    setUserList([]);
    
    try {
      const q = query(
        collection(db, "Chat"),
        where(
          "userIds",
          "array-contains",
          user?.primaryEmailAddress?.emailAddress
        )
      );

      const querySnapshot = await getDocs(q);
      const validChats = [];

      // Перевіряємо кожен чат на наявність обох користувачів
      for (const doc of querySnapshot.docs) {
        const chatData = doc.data();
        const otherUser = chatData.users?.find(
          u => u?.email !== user?.primaryEmailAddress?.emailAddress
        );

        if (otherUser) {
          const userExists = await checkUserExists(otherUser.email);
          if (userExists) {
            validChats.push({ ...chatData, id: doc.id });
          } else {
            // Видаляємо чат, якщо інший користувач не існує
            await deleteDoc(doc.ref);
          }
        }
      }

      setUserList(validChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoader(false);
    }
  };

  const mapOtherUserList = () => {
    return userList.map((record) => {
      const otherUser = record.users?.find(
        (userItem) => userItem?.email !== user?.primaryEmailAddress?.emailAddress
      );
      return {
        docId: record.id,
        ...otherUser,
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
          <UserItem userInfo={item} key={item.docId} />
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
    flex: 1,
  },
  content: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary_light,
    paddingBottom: theme.spacing.medium,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 150,
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