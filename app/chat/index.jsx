import React, { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";
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
import { theme } from "../../constants/Colors";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  // Функція для прокрутки до низу
  const scrollToBottom = useCallback(
    (animated = true) => {
      if (messages.length > 0) {
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, [], {
            scrollToBottom: true,
            animated,
          })
        );
      }
    },
    [messages]
  );

  // Отримання деталей чату та налаштування заголовка
  const GetUserDetails = useCallback(async () => {
    const docRef = doc(db, "Chat", params?.id);
    const docSnap = await getDoc(docRef);
    const result = docSnap.data();

    const otherUser = result?.users?.filter(
      (item) => item.email !== user?.primaryEmailAddress?.emailAddress
    );

    if (otherUser?.[0]?.name) {
      navigation.setOptions({
        headerTitle: otherUser[0].name,
      });
    }
  }, [params?.id, user]);

  // Підписка на повідомлення
  useEffect(() => {
    GetUserDetails();

    const unsubscribe = onSnapshot(
      collection(db, "Chat", params?.id, "Messages"),
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(data.createdAt || Date.now());

          return {
            _id: doc.id,
            ...data,
            createdAt,
          };
        });

        setMessages(messageData);

        // Прокрутка після першого завантаження
        if (isInitialLoad && messageData.length > 0) {
          scrollToBottom(false);
          setIsInitialLoad(false);
        }
      }
    );

    return () => unsubscribe();
  }, [params?.id, isInitialLoad]);

  // Підписка на повідомлення (оновлений useEffect)
useEffect(() => {
  GetUserDetails();

  const unsubscribe = onSnapshot(
    collection(db, "Chat", params?.id, "Messages"),
    (snapshot) => {
      const messageData = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate 
            ? data.createdAt.toDate()
            : new Date(data.createdAt || Date.now());

          return {
            _id: doc.id,
            ...data,
            createdAt,
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt); // Сортування новіших повідомлень першими

      setMessages(messageData);

      if (isInitialLoad && messageData.length > 0) {
        scrollToBottom(false);
        setIsInitialLoad(false);
      }
    }
  );

  return () => unsubscribe();
}, [params?.id, isInitialLoad]);
  // Відправка повідомлення
  const onSend = useCallback(
    async (newMessages = []) => {
      const messageWithDate = {
        ...newMessages[0],
        createdAt: new Date(),
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [messageWithDate], {
          scrollToBottom: true,
        })
      );

      await addDoc(
        collection(db, "Chat", params.id, "Messages"),
        messageWithDate
      );
    },
    [params.id]
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
      scrollToBottom
      scrollToBottomOptions={{
        animated: true,
        animationDuration: 400,
      }}
      
      timeFormat="HH:mm"
      dateFormat="DD MMM YYYY"
      showUserAvatar
      alwaysShowSend
      renderUsernameOnMessage
      messagesContainerStyle={{
        paddingBottom: 20, // Це запобігає перекриттю повідомлень
      }}


      renderBubble={(props) => (
        <View
          style={{
            backgroundColor: props.currentMessage.user._id === user?.primaryEmailAddress?.emailAddress 
              ? theme.colors.primary_light // Ваші повідомлення (наприклад, блакитний)
              : theme.colors.gray_light, // Повідомлення співрозмовника (наприклад, сірий)
            borderRadius: 12,
            padding: 10,
            maxWidth: '80%',
          }}
        >
          {props.currentMessage.text && (
            <Text
              style={{
                color:theme.colors.white // Колір тексту для ваших повідомлень
                 
              }}
            >
              {props.currentMessage.text}
            </Text>
          )}
        </View>
      )}
    />
  );
}
