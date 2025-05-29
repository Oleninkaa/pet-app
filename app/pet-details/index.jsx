import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
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

  const [isMyPet, setIsMyPet] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });

    if (user.primaryEmailAddress.emailAddress === pet.email) {
      setIsMyPet(true);
    }
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

  function fixFirebaseUrl(url) {
    const parts = url.split("/o/");
    if (parts.length < 2) return url;
    const [prefix, rest] = parts;
    const [path, query] = rest.split("?");
    const encodedPath = encodeURIComponent(path);
    return `${prefix}/o/${encodedPath}?${query}`;
  }

  const fixedUrl = fixFirebaseUrl(pet.imageUrl);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.wrapper}>
        {isMyPet && (
          <Image
            source={require("./../../assets/images/icons/badge.png")}
            style={styles.badge}
          ></Image>
        )}
        <Image source={{ uri: fixedUrl }} style={styles.image}></Image>
        <View style={styles.content}>
          <PetInfo pet={pet} customStyle={styles.customStyle} />
          <PetSubInfo pet={pet} />
          <AboutPet pet={pet} />
          <OwnerInfo pet={pet} initiateChat={initiateChat} />
          <View style={{ height: 100 }} />
        </View>
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
  wrapper: {},
  badge: {
    width: 80,
    height: 80,
    zIndex: 5,
    position: `absolute`,
    top: theme.spacing.medium,
    right: theme.spacing.medium,
  },
  customStyle: {
    zIndex: 100,
    backgroundColor: theme.colors.accent,
    borderRadius: 20,
    width: 300,
    position: "absolute",
    top: -50,
    minHeight: 100,
    left: "50%",
    transform: [{ translateX: -150 + theme.spacing.large }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

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
  image: {
    width: "100%",
    height: 450,
    objectFit: "cover",
    position: "absolute",
  },
  content: {
    borderRadius: 70,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.colors.white,
    marginTop: 380,
    paddingHorizontal: theme.spacing.large,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
