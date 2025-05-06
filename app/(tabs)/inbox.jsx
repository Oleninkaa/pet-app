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
    setUserList([]);
    const q = query(
      collection(db, "Chat"),
      where(
        "userIds",
        "array-contains",
        user?.primaryEmailAddress?.emailAddress
      )
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserList((prevList) => [...prevList, doc.data()]);
    });
    setLoader(false);
  };

  const mapOtherUserList = () => {
    const list = [];
    userList.forEach((record) => {
      const otherUser = record.users?.filter(
        (user) => user?.email != user?.primaryEmailAddress?.emailAddress
      );
      const result = {
        docId: record.id,
        ...otherUser[0],
      };
      list.push(result);
    });
    return list;
  };
  return (
    <View style={styles.wrapper}>
      <Text style={styles.content}>Inbox</Text>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent} // Add this
        refreshing={loader}
        onRefresh={() => getUserList()}
        data={mapOtherUserList()}
        renderItem={({ item, index }) => (
          <UserItem userInfo={item} key={index} />
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
                You have nothing on your inbox yet. It`s never too late to change
                it!
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