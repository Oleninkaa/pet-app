import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { theme } from "./../../constants/Colors";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import React, { useEffect, useState } from "react";
import PetListItem from "./PetListItem";
import { useUser } from "@clerk/clerk-expo";
import Shared from "../../Shared/Shared";

export default function PetListByCategory({ customStyle }) {
  const { user } = useUser();
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]); // Для мульти-лайків
  const [isMultiLikeMode, setIsMultiLikeMode] = useState(false); // Режим мульти-лайків

  useEffect(() => {
    getPetList("Dogs");
  }, []);

  const getPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const pets = [];
    querySnapshot.forEach((doc) => {
      pets.push(doc.data());
    });
    setPetList(pets);
    setLoader(false);
  };

  const toggleMultiLikeMode = () => {
    setIsMultiLikeMode(!isMultiLikeMode);
    if (!isMultiLikeMode) {
      setSelectedPets([]); // Очищаємо вибір при виході з режиму
    }
  };

  const handlePetSelect = (petId) => {
    if (!isMultiLikeMode) return;

    setSelectedPets(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId) 
        : [...prev, petId]
    );
  };



  return (
    <View style={customStyle}>
        <Category category={(value) => getPetList(value)} />
      {petList.length === 0 && (
        <View style={{ alignItems: "center" }}>
          <Image source={require("./../../assets/images/no_results.png")} />
          <Text style={styles.noPets}>No pets available</Text>
        </View>
      )}

      <FlatList
        showsHorizontalScrollIndicator={false}
        data={petList}
        horizontal={true}
        style={{
          paddingBottom: theme.spacing.medium,
          flexGrow: 0,
        }}
        contentContainerStyle={styles.contentContainer}
        refreshing={loader}
        onRefresh={() => getPetList("Dogs")}
        renderItem={({ item }) => (
          <View>
            <PetListItem 
              pet={item} 
              isSelected={selectedPets.includes(item.id)}
              onSelect={handlePetSelect}
              selectMode={isMultiLikeMode}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noPets: {
    marginTop: theme.spacing.medium,
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.medium,
    color: theme.colors.primary,
  },
  contentContainer: {
    gap: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.medium,
  },
  multiLikeControls: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  multiLikeButton: {
    fontFamily: "inter-semiBold",
    color: theme.colors.primary,
    padding: theme.spacing.small,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.spacing.small,
  },
  multiLikeActionButton: {
    fontFamily: "inter-semiBold",
    color: theme.colors.white,
    padding: theme.spacing.small,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.small,
  },
});