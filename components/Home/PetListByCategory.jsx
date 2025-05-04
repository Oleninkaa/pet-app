import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { theme } from "./../../constants/Colors";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import React, { useEffect, useState } from "react";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  console.log("PetListByCategory", petList);
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
      {petList.length === 0 && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Image
            source={require("./../../assets/images/no_results.png")}
          ></Image>
          <Text style={styles.noPets}>No pets available</Text>
        </View>
      )}

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
const styles = StyleSheet.create({
  noPets: {
    marginTop: theme.spacing.medium,
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.medium,
    color: theme.colors.primary,
  },
});
