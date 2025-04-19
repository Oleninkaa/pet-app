import { View, Text, FlatList } from "react-native";

import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import React, { useEffect, useState } from "react";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getPetList("Dogs");
  }, []);
  const getPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setPetList((prev) => [...prev, doc.data()]);
    });
    setLoader(false);
  };
  return (
    <View>
      <Category category={(value) => getPetList(value)} />

      <FlatList
        data={petList}
        horizontal={true}
        style={{ marginTop: 10 }}
        refreshing={loader}
        onRefresh={() => getPetList("Dogs")}
        renderItem={({ item, index }) => <PetListItem pet={item} />}
      ></FlatList>
    </View>
  );
}
