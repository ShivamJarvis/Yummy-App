import { StyleSheet, Text, View,Image } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { SafeAreaView } from "react-native-safe-area-context";

const OnboardingScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{minHeight:"100%"}}>
      <Onboarding
      onSkip={()=>navigation.replace("LoginScreen")}
      onDone={()=>navigation.navigate("LoginScreen")}
        pages={[
          {
            backgroundColor: "#f7d383",
            image: <Image source={require("../../assets/images/Yummy-1.png")} style={{width:400,height:400}}  />,
            title: "Welcome to Yummy",
            subtitle: "Fresh food at your doorstep",
          },
          {
            backgroundColor: "#f7aa83",
            image: <Image source={require("../../assets/images/onboarding-bg-2.png")} style={{width:400,height:400}} />,
            title: "Free Delivery",
            subtitle: "No any hidden cost included on your order",
          },
          {
            backgroundColor: "#f78783",
            image: <Image source={require("../../assets/images/onboarding-bg-3.png")} style={{width:370,height:370}} />,
            title: "On Time Delivery",
            subtitle: "We deliver food at your doorstep on time or free",
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({

    

});
