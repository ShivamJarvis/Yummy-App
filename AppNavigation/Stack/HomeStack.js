import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'
import AddAddressScreen from "../../Screens/HelperScreens/AddAddressScreen";
import ActiveOrderDetailScreen from "../../Screens/MainNavigationScreens/ActiveOrderDetailScreen";
import CartScreen from "../../Screens/MainNavigationScreens/CartScreen";
import CuisineBasedRestraunts from "../../Screens/MainNavigationScreens/CuisineBasedRestraunts";
import HomeScreen from "../../Screens/MainNavigationScreens/HomeScreen";
import ProceedToPay from "../../Screens/MainNavigationScreens/ProceedToPay";
import RestrauntDetailsScreen from "../../Screens/MainNavigationScreens/RestrauntDetailsScreen";

const Stack = createNativeStackNavigator();


const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown:false,
    }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RestrauntDetailsScreen" component={RestrauntDetailsScreen} />
      <Stack.Screen name="CuisineBasedRestraunts" component={CuisineBasedRestraunts} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
      <Stack.Screen name="ProceedToPay" component={ProceedToPay} />
      <Stack.Screen name="ActiveOrderDetailScreen" component={ActiveOrderDetailScreen} />
    </Stack.Navigator>
  )
}

export default HomeStack