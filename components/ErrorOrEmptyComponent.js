import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import FooterComponent from "./FooterComponent";

const ErrorOrEmptyComponent = ({
  iconName,
  title,
  subTitle,
  screenName,
  isRefresh,
  buttonText,
  headerText,
}) => {
    const  navigation = useNavigation()
  return (
    <View style={{flex:1,backgroundColor:"#ffffff"}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <FeatherIcon
            name="chevron-left"
            size={35}
            style={{ color: "#f78783" }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerText}</Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#ffffff" }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: "center",
            marginTop:60,
            justifyContent: "center",
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <FeatherIcon name={iconName} size={150} color="#6e6e6e" />
            <Text style={{ fontSize: 25, marginTop: 20, fontWeight: "700" }}>
              {title}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 15,
                fontSize: 16,
                fontWeight: "700",
                color: "#6e6e6e",
              }}
            >
              {subTitle}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.7} onPress={()=>{
                if(screenName){
                    navigation.navigate(screenName)
                }
            }}>
              <Text style={{fontSize:18,color:"#ffffff",fontWeight:"700"}}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FooterComponent />
      </ScrollView>
    </View>
  );
};

export default ErrorOrEmptyComponent;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 18,
    textAlign:"center"
  },
  buttonStyle:{
    backgroundColor:"#ff6666",
    width:Dimensions.get('window').width-30,
     alignSelf:"center",
     paddingVertical:10,
     alignItems:"center",
     borderRadius:10,
     marginTop:50
    }
});
