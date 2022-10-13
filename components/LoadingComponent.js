import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingComponent = () => {
  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      {/* <ActivityIndicator style={{}} size={45} color="#FF6666" /> */}
      <Image
        source={require("./../assets/images/loading.gif")}
        style={{ width: 150, height: 150 }}
      />
    </SafeAreaView>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({});
