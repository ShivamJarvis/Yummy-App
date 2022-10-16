import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import IonIcon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_URL, WS_URL } from "@env";
import FeatherIcon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterComponent from "../../components/FooterComponent";
import { authContext } from "../../contexts/AuthContext";
import LoadingComponent from "./../../components/LoadingComponent";
import ADIcon from "react-native-vector-icons/AntDesign";
import MiIcon from "react-native-vector-icons/MaterialIcons";

const ActiveOrderDetailScreen = ({ navigation, route }) => {
  const { order_id } = route.params;
  const [orderDetails, setOrderDetails] = useState({});
  const [orderStatus, setOrderStatus] = useState({});
  const [customerLocation, setCustomerLocation] = useState({});
  const [restrauntLocation, setRestrauntLocation] = useState({});
  const [dpLocation, setDpLocation] = useState({});
  const [deliveryPartner, setDeliveryPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = authContext();
  const mapRef = useRef(null);
  const ws = useRef(new WebSocket(WS_URL + "/ws/order/" + order_id + "/")).current;

  

  useEffect(() => {
    ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      const data = JSON.parse(res.payload.value);

      setOrderStatus(data);
      setDpLocation({
        latitude: data.dp_latitude,
        longitude: data.dp_longitude,
      });

      setDeliveryPartner(data.delivery_partner);
    };
  }, []);

  const startCall = () => {
    if (!deliveryPartner || !deliveryPartner?.user?.mobile_no) {
      return;
    }
    Linking.openURL(`tel:${deliveryPartner?.user?.mobile_no}`);
  };

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

        console.log("======>", data);

        setOrderDetails(data);

        setCustomerLocation({
          latitude: data.customer_latitude,
          longitude: data.customer_longitude,
        });
        setRestrauntLocation({
          latitude: data.restraunt_latitude,
          longitude: data.restraunt_longitude,
        });

        setOrderStatus({
          status: data.order_status,
        });

        setDeliveryPartner(data.delivery_partner);
        if (data.deliveryPartner) {
        }

        setDpLocation({
          latitude: data.dp_latitude,
          longitude: data.dp_longitude,
        });

        
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
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: "#f7cdcd",
            borderRadius: 15,
            marginLeft: 10,
            marginTop: 5,
          }}
        >
          <FeatherIcon
            name="chevron-left"
            size={35}
            style={{ color: "#f78783" }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <MapView
          ref={mapRef}
          mapType="mutedStandard"
          style={{
            height: 300,
            width: "100%",
            position: "relative",
          }}
          initialRegion={{
            latitude:
              dpLocation.latitude == 0
                ? restrauntLocation.latitude
                : dpLocation.latitude,
            longitude:
              dpLocation.longitude == 0
                ? restrauntLocation.longitude
                : dpLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          region={{
            latitude:
              dpLocation.latitude == 0
                ? restrauntLocation.latitude
                : dpLocation.latitude,
            longitude:
              dpLocation.longitude == 0
                ? restrauntLocation.longitude
                : dpLocation.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
          provider={PROVIDER_GOOGLE}
          onMapLoaded={() => {
            if (dpLocation && dpLocation.latitude > 0) {
              mapRef.current.fitToSuppliedMarkers([
                "customer_coordinates",
                "restraunt_coordinates",
                "delivery_partner_coordinates",
              ]);
            } else {
              mapRef.current.fitToSuppliedMarkers([
                "customer_coordinates",
                "restraunt_coordinates",
              ]);
            }
          }}
        >
          <Marker
            coordinate={customerLocation}
            draggable={false}
            focusable={true}
            identifier="customer_coordinates"
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#000000",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 10,

                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  Delivery Location
                </Text>
              </View>
              <IonIcon name="pin" size={45} color={"#000000"} />
            </View>
          </Marker>

          <Marker
            coordinate={restrauntLocation}
            draggable={false}
            focusable={true}
            identifier="restraunt_coordinates"
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#000000",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 10,

                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  Restraunt Location
                </Text>
              </View>
              <IonIcon name="pin" style={{}} size={45} color={"#000000"} />
            </View>
          </Marker>

          <Marker
            coordinate={dpLocation}
            draggable={false}
            focusable={true}
            identifier="delivery_partner_coordinates"
          >
            <View style={{ alignItems: "center" }}>
              <MiIcon
                name="delivery-dining"
                style={{}}
                size={35}
                color={"#ff6666"}
              />
            </View>
          </Marker>
        </MapView>

        <View style={styles.orderDetailsContainer}>
          <View style={styles.row}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#ff6666" }}>
              ORDER ID
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#2b2b2b" }}>
              #{orderDetails.order_id}
            </Text>
          </View>

          <View style={styles.liveStatusContainer}>
            <View style={{ marginRight: 10 }}>
              <Image
                source={require("./../../assets/images/pulse.gif")}
                style={{ width: 30, height: 30 }}
              />
            </View>

            <View>
              <Text style={{ fontWeight: "700", marginBottom: 5 }}>
                LIVE STATUS
              </Text>
              <Text
                style={{ color: "#ff5555", fontSize: 16, fontWeight: "700" }}
              >
                {orderStatus.status}
              </Text>
            </View>
          </View>

          <View style={{...styles.liveStatusContainer, marginTop:0}}>
            <View style={{ marginRight: 10 }}>
            <Text style={{ fontWeight: "700", marginBottom: 5 }}>Net Amount <Text style={{fontWeight:"500",color:"#6e6e6e",fontSize:12}}>
              
               ({orderDetails.is_cod ? "Pay on Delivery": "Paid Online"})</Text>
              </Text>

            <View>
              <Text style={{ fontWeight: "700", marginBottom: 5,fontSize:18 }}>
              ₹{orderDetails.order_net_amount}
              </Text>
             
            </View>
          </View>
          </View>

          {deliveryPartner ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  marginRight: 10,
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 10,
                  borderColor: "#ff6666",
                }}
              >
                {deliveryPartner && deliveryPartner?.user?.profile_photo ? (
                  <Image
                    source={{ uri: deliveryPartner.user.profile_photo }}
                    style={{ width: 30, height: 30 }}
                  />
                ) : (
                  <ADIcon name="user" color={"#ff6666"} size={30} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ marginBottom: 5 }}>
                  {deliveryPartner?.user?.name} is your delivery partner for
                  your order. Feel free to call him for real time updates.
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 11,
                    color: "#6e6e6e",
                    fontWeight: "700",
                  }}
                >
                  {deliveryPartner?.user?.name} {deliveryPartner?.description}
                </Text>
              </View>

              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    backgroundColor: "#ff6666",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={startCall}
                >
                  <FeatherIcon name="phone" color="#ffffff" size={18} />
                  <Text style={{ color: "#ffffff", marginLeft: 5 }}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>
                We soon assign delivery partner
              </Text>
            </View>
          )}
          
          
        </View>



        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActiveOrderDetailScreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    zIndex: 12121,
  },
  orderDetailsContainer: {
    marginTop: -10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 25,
    paddingVertical: 30,
    elevation: 10,
    borderRadius: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    elevation: 10,
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
    backgroundColor: "#ffffff",
  },
});
