import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../config/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import PetListItem from "../../components/Home/PetListItem";
import { theme } from "./../../constants/Colors";

export default function Favourite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);
  const { width } = useWindowDimensions();

  const cardWidth =
    (width - theme.spacing.large * 2 - theme.spacing.medium) / 2;

  useEffect(() => {
    user && getFavPetIds();
  }, [user]);

  const getFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.getFavList(user);
    setFavIds(result?.favourites || []);
    getFavPetList(result?.favourites || []);
    setLoader(false);
  };

  const getFavPetList = async (favId_) => {
    setLoader(true);
    setFavPetList([]);

    // If no favorites, skip the query
    if (favId_.length === 0) {
      setLoader(false);
      return;
    }

    const q = query(collection(db, "Pets"), where("id", "in", favId_));
    const querySnapshot = await getDocs(q);

    const newFavPetList = [];
    querySnapshot.forEach((doc) => {
      newFavPetList.push(doc.data());
    });

    setFavPetList(newFavPetList);
    setLoader(false);
  };

  // This function will be passed to PetListItem to handle like removal
  const handleLikeRemoved = (removedPetId) => {
    // Filter out the removed pet from both lists
    setFavIds((prev) => prev.filter((id) => id !== removedPetId));
    setFavPetList((prev) => prev.filter((pet) => pet.id !== removedPetId));
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>Favourites</Text>
      <FlatList
        data={favPetList}
        numColumns={2}
        style={styles.container}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        onRefresh={getFavPetIds} // Refresh both IDs and list
        refreshing={loader}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { width: cardWidth }]}>
            <PetListItem
              pet={item}
              onLikeRemoved={handleLikeRemoved} // Pass the handler
            />
          </View>
        )}
        ListEmptyComponent={
          !loader && (
            <View style={styles.emptyContainer}>
              <Image
                style={styles.emptyImage}
                source={require("./../../assets/images/no_favs.png")}
              />
              <Text style={styles.emptyTitle}>No favorites</Text>
              <Text style={styles.emptyText}>
                You have nothing on your list yet. It`s never too late to change
                it!
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.spacing.large,
    flex: 1,
  },
  text: {
    fontFamily: "inter-bold",
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.primary_light,
    paddingBottom: theme.spacing.medium,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.xLarge,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    gap: theme.spacing.medium,
  },
  itemContainer: {

  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: "inter-semiBold",
    fontSize: theme.fontSize.large,
    color: theme.colors.accent,
  },
  emptyText: {
    marginTop: theme.spacing.small,
    fontFamily: "inter",
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray_ultra_light,
    textAlign: "center",
    maxWidth: 300,
  },
  emptyImage: {
    width: 200,
    height: 200,
    objectFit: "contain",
    marginBottom: theme.spacing.medium,
  },
});
