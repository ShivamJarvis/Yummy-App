import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import MyOrdersScreen from "../Screens/MainNavigationScreens/MyOrdersScreen";
import ProceedToPay from "../Screens/MainNavigationScreens/ProceedToPay";
import RestrauntDetailsScreen from "../Screens/MainNavigationScreens/RestrauntDetailsScreen";
import DeliveredOrderedDetailScreen from "../Screens/MainNavigationScreens/DeliveredOrderedDetailScreen";
import AddAddressScreen from "../Screens/HelperScreens/AddAddressScreen";
import ActiveOrderDetailScreen from "../Screens/MainNavigationScreens/ActiveOrderDetailScreen";
import CartScreen from "../Screens/MainNavigationScreens/CartScreen";
import CuisineBasedRestraunts from "../Screens/MainNavigationScreens/CuisineBasedRestraunts";
import BottomStackNavigation from "./Stack/BottomStackNavigation";
import SearchScreen from "../Screens/MainNavigationScreens/SearchScreen";
import MyFavouritesRestrauntScreen from "../Screens/MainNavigationScreens/MyFavouritesRestrauntScreen";
import ManageAddressesScreen from "../Screens/MainNavigationScreens/ManageAddressesScreen";

const Stack = createNativeStackNavigator();

const ProtectedRouteNavigation = () => {


 
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
      <Stack.Screen name="HomeScreen" component={BottomStackNavigation} />
      <Stack.Screen name="RestrauntDetailsScreen" component={RestrauntDetailsScreen} />
      <Stack.Screen name="CuisineBasedRestraunts" component={CuisineBasedRestraunts} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
      <Stack.Screen name="ProceedToPay" component={ProceedToPay} />
      <Stack.Screen name="ActiveOrderDetailScreen" component={ActiveOrderDetailScreen} />
      <Stack.Screen name="DeliveredOrderedDetailScreen" component={DeliveredOrderedDetailScreen} />
      <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="MyFavouritesRestrauntScreen" component={MyFavouritesRestrauntScreen} />
      <Stack.Screen name="ManageAddressesScreen" component={ManageAddressesScreen} />
      </Stack.Navigator>
    );
 
};

export default ProtectedRouteNavigation;
