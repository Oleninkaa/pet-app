import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from "react-native";
import React from "react";
import { theme } from "./../../constants/Colors";
import { useRouter } from "expo-router";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Entypo from "@expo/vector-icons/Entypo";

export default function HomeScreen() {
  const router = useRouter();

  const handleAddNewPet = () => {
    router.push("../add-new-pet");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Header />
          <Slider />
          <PetListByCategory customStyle={styles.customStyle} />
        </ScrollView>
        
        {/* Кнопка фіксована внизу поза ScrollView */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleAddNewPet}
            style={styles.addNewPet}
          >
            <Entypo name="plus" size={30} color={theme.colors.accent} />
            <Text style={styles.newPetText}>Add new pet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.large,
    paddingBottom: 50, // Додатковий відступ для кнопки
  },
  customStyle: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewPet: {
    backgroundColor: theme.colors.light,
    padding: theme.spacing.medium,
    borderRadius: 40,
    borderColor: theme.colors.accent,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xSmall,
    width: 250,
  },
  newPetText: {
    fontFamily: "inter-bold",
    color: theme.colors.accent,
    fontSize: theme.fontSize.large,
  },
});