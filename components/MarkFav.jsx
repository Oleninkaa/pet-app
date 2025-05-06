import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { theme } from "../constants/Colors";

export default function MarkFav({ pet, color = "black", size = 25, isSelected, onSelect, selectMode, customFill }) {
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    user && getFav();
  }, [user]);

  const getFav = async () => {
    const result = await Shared.getFavList(user);
    setFavList(result?.favourites || []);
  };

  const handlePress = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (selectMode) {
        // В режимі вибору просто передаємо подію батьківському компоненту
        onSelect && onSelect(pet.id);
      } else {
        // Звичайний режим - обробляємо одразу
        if (favList.includes(pet.id)) {
          await removeFromFav(pet.id);
        } else {
          await addToFav(pet.id);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const addToFav = async (petId) => {
    const updatedFavList = [...favList, petId];
    await Shared.updateFav(user, updatedFavList);
    setFavList(updatedFavList);
  };

  const removeFromFav = async (petId) => {
    const updatedFavList = favList.filter(id => id !== petId);
    await Shared.updateFav(user, updatedFavList);
    setFavList(updatedFavList);
  };

  
  
  // Визначення стану для відображення
  const showFilled = selectMode ? isSelected : favList.includes(pet.id);
  const iconColor = showFilled ? customFill || theme.colors.accent : color;

  return (
    <Pressable onPress={handlePress} disabled={isProcessing}>
      <Ionicons 
        name={showFilled ? "heart" : "heart-outline"} 
        size={size} 
        color={iconColor} 
      />
    </Pressable>
  );
}