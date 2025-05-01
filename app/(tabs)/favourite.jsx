import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../config/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import PetListItem from "../../components/Home/PetListItem";

export default function Favourite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    user && getFavPetIds();
  }, [user]);

  const getFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.getFavList(user);
    setFavIds(result?.favourites);
    getFavPetList(result?.favourites);
    setLoader(false);
  };

  const getFavPetList = async (favId_) => {
    setLoader(true);
    setFavPetList([]);
    const q = query(collection(db, "Pets"), where("id", "in", favId_));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setFavPetList((prev) => [...prev, doc.data()]);
    });

    setLoader(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>Favourites</Text>
      <FlatList
        data={favPetList}
        numColumns={2}
        style={styles.wrapper}
        onRefresh={() => getFavPetList()}
        refreshing={loader}
        renderItem={({ item }) => (
          <View>
            <PetListItem pet={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    marginTop: 20,
  },
  text: {
    fontFamily: "montserrat-medium",
    fontSize: 30,
  },
});
