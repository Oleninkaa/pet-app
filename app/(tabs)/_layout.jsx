import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from "./../../constants/Colors";


export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
    }}>
        <Tabs.Screen name="home"
        options={{
          title : 'Home',
          headerShown : false,
          tabBarIcon : ({color}) => <Entypo name="home" size={24} color={color} />
          }}/>
        <Tabs.Screen name="favourite"
         options={{
          title : 'Favoutite',
          headerShown : false,
          tabBarIcon : ({color}) =><AntDesign name="heart" size={24} color={color} />
          }}/>
        <Tabs.Screen name="inbox"
        options={{
          title : 'Inbox',
          headerShown : false,
          tabBarIcon : ({color}) => <MaterialIcons name="email" size={24} color={color} />
          }}/>
        <Tabs.Screen name="profile"
        options={{
          title : 'Profile',
          headerShown : false,
          tabBarIcon : ({color}) => <MaterialCommunityIcons name="face-man-profile" size={24} color={color} />
          }}/>
    </Tabs>
  )
}