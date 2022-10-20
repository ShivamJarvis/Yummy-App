import { StyleSheet } from "react-native";
import ProfileScreen from "../../Screens/MainNavigationScreens/ProfileScreen";
import FoodScreen from "../../Screens/MainNavigationScreens/FoodScreen";
import DineoutScreen from "../../Screens/MainNavigationScreens/DineoutScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IoniIcons from "react-native-vector-icons/Ionicons";
import FaIcons from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../../Screens/MainNavigationScreens/HomeScreen";



const Stack = createBottomTabNavigator();

const BottomStackNavigation = () => {
  return (
    <>
   
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          marginVertical: 10,
          marginHorizontal: 10,
          height: 65,
          paddingBottom: 5,
          borderRadius: 10,
          backgroundColor: "#f78783",
          

        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#eddeca",
        tabBarLabelStyle:{fontSize:12,fontWeight:"bold"},
        
        
      }}
      sceneContainerStyle={{
        margin: 0,
        
       
      }}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            iconName = focused ? "home" : "home-outline";
            return <IoniIcons name={iconName} size={size} color={color} />;
          },
          title: "Home",
          
        }}
      />
      <Stack.Screen
        name="FoodScreen"
        component={FoodScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            iconName = focused ? "fast-food" : "fast-food-outline";
            return <IoniIcons name={iconName} size={size} color={color} />;
          },
          title: "Food",
        }}
        />
      <Stack.Screen
        name="DineoutScreen"
        component={DineoutScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            iconName = focused ? "ios-restaurant" : "ios-restaurant-outline";
            return <IoniIcons name={iconName} size={size} color={color} />;
          },
          title: "Dineout",
        }}
        />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            iconName = focused ? "user" : "user-o";
            return <FaIcons name={iconName} size={size} color={color} />;
          },
          title: "Profile",
        }}
      />
    </Stack.Navigator>
    
    </>
  );
};

export default BottomStackNavigation;

const styles = StyleSheet.create({});