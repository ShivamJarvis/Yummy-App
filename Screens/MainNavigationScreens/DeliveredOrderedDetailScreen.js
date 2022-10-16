import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_URL, WS_URL } from "@env";

import { authContext } from "../../contexts/AuthContext";
import LoadingComponent from "./../../components/LoadingComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import VegNonVegSymbol from "../../components/RestrauntComponent/VegNonVegSymbol";
import FooterComponent from "../../components/FooterComponent";
import Timeline from "react-native-timeline-flatlist";

const DeliveredOrderedDetailScreen = ({ navigation, route }) => {
  const { order_id } = route.params;
  const [orderDetails, setOrderDetails] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = authContext();

  const getOrderDetails = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/restraunt/order-detail/?order_id=${order_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.data.length > 0) {
          const data = res.data[0];
          console.log(data)

        setOrderDetails(data);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getOrderDetails();
  }, [order_id]);

  if (isLoading) {
    return <LoadingComponent />;
  }

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
          <FeatherIcon
            name="chevron-left"
            size={35}
            style={{ color: "#f78783" }}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>ORDER #{orderDetails.order_id}</Text>
          <Text style={styles.headerSubTitle}>
            Delivered, {orderDetails.item_count} items, ₹
            {orderDetails.order_net_amount}
          </Text>
        </View>
      </View>

      
      
      <ScrollView style={{ paddingHorizontal: 10 }}>

        <View style={{...styles.floatContainer,paddingVertical:20,marginHorizontal:8,flexDirection:"column"}}>
   

       
        <View style={{flexDirection:"row",alignItems:"center"}}>
            <IonIcon name="ios-location-outline" size={20} />
            <View style={{marginHorizontal:10}} >
                <Text style={{fontWeight:"700",color:"#ff6666"}}>{orderDetails.restraunt.name}</Text>
                <Text numberOfLines={1} style={{color:"#6e6e6e"}}>{orderDetails.restraunt.address_line_1}, {orderDetails.restraunt.address_line_2}</Text>
            </View>
        </View>

        <View style={{borderLeftWidth:1,height:40,borderStyle:"dashed",marginLeft:10,borderLeftColor:"#6e6e6e"}}></View>

        <View style={{flexDirection:"row",alignItems:"center",marginBottom:20}}>
            <IonIcon name="ios-home-outline" size={20} />
            <View style={{marginHorizontal:10}} >
                <Text style={{fontWeight:"700",color:"#ff6666"}}>{orderDetails.customer_address_type}</Text>
                <Text numberOfLines={1} style={{color:"#6e6e6e"}}>{orderDetails.customer_address}</Text>
            </View>
        </View>
        

           <View style={{flexDirection:"row",alignItems:"center"}}> 
            <IonIcon name="checkmark-done-sharp" size={20} color={"#297000"} />
            <Text style={{fontSize:12,color:"#6e6e6e",marginLeft:5}}>Order delivered on {orderDetails.order_date} by {orderDetails.delivery_partner.user.name}</Text></View>
          </View>

        <View style={{ marginHorizontal: 10, marginTop: 20 }}>
          <Text style={{ fontWeight: "700", fontSize: 15 }}>Bill Details</Text>

          <View style={styles.floatContainer}>
            {orderDetails.order.map((item) => {
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <VegNonVegSymbol is_veg={item.item.is_veg} />
                    <Text style={{ marginLeft: 5, fontSize: 12 }}>
                      {item.item.item_name} x {item.qty}
                    </Text>
                  </View>
                  <Text>₹{item.item_price}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <FooterComponent />

      </ScrollView>
      
    </SafeAreaView>
  );
};

export default DeliveredOrderedDetailScreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
    zIndex: 12121,
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 15,
  },
  headerSubTitle: {
    color: "#6e6e6e",
    fontSize: 12,
  },
  floatContainer: {
    backgroundColor: "#ffffff",
    elevation: 20,
    shadowColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
  },
});
