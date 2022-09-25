import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import LoginScreen from "../Screens/LoginNavigationScreens/LoginScreen";
import OnboardingScreen from "../Screens/LoginNavigationScreens/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VerificationCode from "../Screens/LoginNavigationScreens/VerificationCode";

const Stack = createNativeStackNavigator();

const LoginNavigation = () => {
  const [isFirstlaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched")
      .then((value) => {
        if (value === null) {
          AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
     
        }
      })
      .catch((err) => {
        setIsFirstLaunch(false);
      });
  }, []);

  if (isFirstlaunch === null) {
    return null
  }
  else if (isFirstlaunch === true) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="VerificationCode" component={VerificationCode} />
      </Stack.Navigator>
    );
  } else {
      return (
      <Stack.Navigator
      screenOptions={{
          headerShown: false,
        }}
        >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="VerificationCode" component={VerificationCode} />
      </Stack.Navigator>
    );
  }
};

export default LoginNavigation;
