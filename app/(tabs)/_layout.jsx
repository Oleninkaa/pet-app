import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { theme } from "./../../constants/Colors";
import {
  FontAwesome,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";

// This will keep all tabs rendered in memory
const TABS = ['home', 'favourite', 'inbox', 'profile'];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.gray_ultra_light,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 0,
          height: 60,
   
          
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.small,
          fontFamily: "inter-semiBold",
       
        },
        tabBarIconStyle: {
          
        },
      }}
      sceneContainerStyle={{ backgroundColor: theme.colors.background }}
    >
      {TABS.map((tabName) => (
        <Tabs.Screen
          key={tabName}
          name={tabName}
          options={{
            title: getTabTitle(tabName),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
                {renderTabIcon(tabName, color, focused)}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

// Helper functions for cleaner code
function getTabTitle(tabName) {
  switch (tabName) {
    case 'home': return 'Home';
    case 'favourite': return 'Favorites';
    case 'inbox': return 'Messages';
    case 'profile': return 'Profile';
    default: return '';
  }
}

function renderTabIcon(tabName, color, focused) {
  const iconProps = {
    size: 24,
    color,
    style: focused ? { transform: [{ scale: 1.1 }] } : null
  };

  switch (tabName) {
    case 'home':
      return <FontAwesome name="paw" {...iconProps} />;
    case 'favourite':
      return <AntDesign name="heart" {...iconProps} />;
    case 'inbox':
      return <Ionicons name="chatbubble-ellipses-outline" {...iconProps} />;
    case 'profile':
      return <FontAwesome name="user" {...iconProps} />;
    default:
      return null;
  }
}

const styles = {
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  activeIconContainer: {

  }
};