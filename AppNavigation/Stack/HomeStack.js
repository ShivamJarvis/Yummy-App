import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'
import HomeScreen from "../../Screens/MainNavigationScreens/HomeScreen";
import RestrauntDetailsScreen from "../../Screens/MainNavigationScreens/RestrauntDetailsScreen";

const Stack = createNativeStackNavigator();


const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown:false,
    }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RestrauntDetailsScreen" component={RestrauntDetailsScreen} />
    </Stack.Navigator>
  )
}

export default HomeStack
