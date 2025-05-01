import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import { theme } from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const initiateChat = async () => {
    try {
      // Перевірка наявності обов'язкових полів
      if (!user?.primaryEmailAddress?.emailAddress || !pet?.email) {
        Alert.alert("Error", "Email information is missing");
        return;
      }

      const userEmail = user.primaryEmailAddress.emailAddress;
      const petEmail = pet.email;

      // Перевірка, чи не однакові email
      if (userEmail === petEmail) {
        Alert.alert("Error", "Cannot chat with yourself");
        return;
      }

      const docId1 = `${userEmail}_${petEmail}`;
      const docId2 = `${petEmail}_${userEmail}`;

      // Пошук існуючого чату
      const q = query(
        collection(db, "Chat"),
        where("id", "in", [docId1, docId2])
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        // Якщо чат існує
        querySnapshot.forEach((doc) => {
          console.log("Existing chat found:", doc.id);
          router.push({
            pathname: "/chat",
            params: { id: doc.id },
          });
        });
      } else {
        // Створення нового чату
        console.log("Creating new chat");

        // Підготовка даних з перевіркою на undefined
        const chatData = {
          id: docId1,
          users: [
            {
              email: userEmail,
              imageUrl: user?.imageUrl || null, // Замінюємо undefined на null
              name: user?.fullName || "No Name", // Замінюємо undefined на дефолтне значення
            },
            {
              email: petEmail,
              imageUrl: pet?.userImage || null,
              name: pet?.username || "No Name",
            },
          ],
          userIds: [userEmail, petEmail],
          createdAt: new Date().toISOString(),
        };

        // Додаткова перевірка перед записом
        console.log("Chat data to be saved:", chatData);

        await setDoc(doc(db, "Chat", docId1), chatData);

        console.log("New chat created with ID:", docId1);

        router.push({
          pathname: "/chat",
          params: { id: docId1 },
        });
      }
    } catch (error) {
      console.error("Error in initiateChat:", error);
      Alert.alert("Error", "Failed to start chat: " + error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo pet={pet} />
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={initiateChat}>
          <Text style={styles.buttonText}>Adopt Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  button: {
    padding: 15,
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "montserrat-medium",
    fontSize: 20,
    color: "white",
  },
});
