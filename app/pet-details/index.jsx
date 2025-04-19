import { View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native'
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';

import { theme } from '../../constants/Colors'
export default function PetDetails() {

    const pet = useLocalSearchParams();
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
        })
      }, []);
  return (
    <View>
      <ScrollView>
        <PetInfo pet = {pet}></PetInfo>
        <PetSubInfo pet = {pet}></PetSubInfo>
        <AboutPet  pet = {pet}/>
        <OwnerInfo pet={pet}/>
        <View style={{height:100}}></View>
       
      
      </ScrollView>
      <View  style={styles.buttonContainer}>
        <TouchableOpacity  style={styles.button}>
          <Text style={styles.buttonText}>Adopt Me</Text>
        </TouchableOpacity>
      </View>
     
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer:{
    position:'absolute',
    width:'100%',
    bottom:0,
  },  
  button:{
   padding:15,
   backgroundColor: theme.colors.primary,
  },
  buttonText:{
    textAlign:'center',
    fontFamily:'montserrat-medium',
    fontSize: 20,
  }
})