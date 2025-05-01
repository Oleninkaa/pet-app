import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { GiftedChat } from "react-native-gifted-chat";
import moment from "moment";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  useEffect(() => {
    GetUserDetails();
    const unsubscribe = onSnapshot(
      collection(db, "Chat", params?.id, "Messages"),
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert Firestore timestamp to Date object if needed
          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt
            ? new Date(data.createdAt)
            : new Date();
          return {
            _id: doc.id,
            ...data,
            createdAt: createdAt,
          };
        });
        setMessages(messageData);
      }
    );

    return () => unsubscribe();
  }, []);

  const GetUserDetails = async () => {
    const docRef = doc(db, "Chat", params?.id);
    const docSnap = await getDoc(docRef);

    const result = docSnap.data();
    const otherUser = result?.users.filter(
      (item) => item.email != user?.primaryEmailAddress?.emailAddress
    );
    navigation.setOptions({
      headerTitle: otherUser[0].name,
    });
  };

  const onSend = async (newMessage) => {
    // Create a proper Date object for the message
    const messageWithDate = [
      {
        ...newMessage[0],
        createdAt: new Date(),
      },
    ];

    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, messageWithDate)
    );

    // For Firestore, you can use either a Date object or Firestore's serverTimestamp
    await addDoc(
      collection(db, "Chat", params.id, "Messages"),
      messageWithDate[0]
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
      // Optional: Customize how dates are displayed
      timeFormat="HH:mm"
      dateFormat="DD MMM YYYY"
    />
  );
}
