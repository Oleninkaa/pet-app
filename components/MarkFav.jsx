import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";

export default function MarkFav({ pet, color = "black" }) {
  const { user } = useUser();
  const [favList, setFavList] = useState([]);

  useEffect(() => {
    user && getFav();
  }, []);

  const getFav = async () => {
    const result = await Shared.getFavList(user);
    setFavList(result?.favourites ? result?.favourites : []);
  };

  const addToFav = async () => {
    const favResult = favList;
    favResult.push(pet.id);
    await Shared.updateFav(user, favResult);
    getFav();
  };

  const removeFromFav = async () => {
    const favResult = favList.filter((item) => item !== pet.id);
    await Shared.updateFav(user, favResult);
    getFav();
  };
  return (
    <View>
      {favList.includes(pet.id) ? (
        <Pressable onPress={removeFromFav}>
          <Ionicons name="heart" size={30} color={"red"} />
        </Pressable>
      ) : (
        <Pressable onPress={() => addToFav()}>
          <Ionicons name="heart-outline" size={30} color={color} />
        </Pressable>
      )}
    </View>
  );
}
