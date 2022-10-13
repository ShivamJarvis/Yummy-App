import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

const RequestLocationPermission = () => {
  const pkg = Constants.manifest.releaseChannel
    ? Constants.manifest.android.package
    : "host.exp.exponent";

  const openAppSettings = async() => {
    try {

      if (Platform.OS === "ios") {
        Linking.openURL("app-settings:");
      } else {
        await startActivityAsync(
          ActivityAction.APPLICATION_DETAILS_SETTINGS,
          { data: "package:" + pkg }
        );
      }
    } catch (err) {
      console.log(err)

    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: 25,
      }}
    >
      <Image
        source={require("./../../assets/images/location-anim.gif")}
        style={{
          flex: 1,
          height: "auto",
          width: Dimensions.get("window").width - 50,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#ff6666", fontSize: 25, fontWeight: "700" }}>
          Grant Access
        </Text>
        <Text style={{ color: "#ff6666", fontSize: 16, marginTop: 15 }}>
          Change Permission's in your device app settings. Give Yummy access to
          location for better serve.
        </Text>
      </View>
      <TouchableOpacity onPress={openAppSettings} style={{backgroundColor:"#ff6666",paddingVertical:15,borderRadius:10,width:Dimensions.get('window').width-50,alignSelf:"center",
    marginBottom:20}}>
        <Text style={{textAlign:"center",color:"#ffffff",fontSize:18}}>Settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RequestLocationPermission;

const styles = StyleSheet.create({});
