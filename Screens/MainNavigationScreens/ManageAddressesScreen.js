import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import Icon from "react-native-vector-icons/Feather";
  import axios from "axios";
  import { API_URL } from "@env";
  import { getDistance } from "geolib";
  import DetailedRestrauntCard from "../../components/HomeScreenComponents/DetailedRestrauntCard";
  import { authContext } from "../../contexts/AuthContext";
  import LoadingComponent from "./../../components/LoadingComponent";
  import CartFloatComponent from "../../components/CartFloatComponent";
  
  
  const ManageAddressesScreen = ({navigation}) => {
   
    
    const [isLoading, setIsLoading] = useState(false);
    const { userAddresses,setUserAddresses } = authContext();
    
  
   
  
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
        }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={35} style={{ color: "#f78783" }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Addresses</Text>
        </View>
  
          <CartFloatComponent />
      </SafeAreaView>
    );
  }
  
  export default ManageAddressesScreen
  
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
      fontSize: 16,
    },
  });
  