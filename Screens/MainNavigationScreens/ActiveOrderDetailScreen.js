import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import IonIcon from "react-native-vector-icons/Ionicons";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";
import axios from "axios";
import { API_URL,WS_URL } from "@env";
import FeatherIcon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterComponent from "../../components/FooterComponent";
import { authContext } from "../../contexts/AuthContext";
import LoadingComponent from "./../../components/LoadingComponent";

const ActiveOrderDetailScreen = ({ navigation, route }) => {
  const screen = Dimensions.get("window");
  const ASPECT_RATIO = screen.width / 300;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const { order_id } = route.params;
  const mapRef = useRef();
  const [orderDetails, setOrderDetails] = useState({});
  const [orderStatus, setOrderStatus] = useState(null);
  const [customerLocation, setCustomerLocation] = useState({});
  const [restrauntLocation, setRestrauntLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = authContext();
  var ws = new WebSocket('ws://192.168.0.105:3000/ws/order/'+order_id+'/');

  ws.onmessage = (e) => {
    // a message was received
    const res = JSON.parse(e.data);
    const data = JSON.parse(res.payload.value)
    setOrderStatus(data.status)
  };

  const getOrderDetails = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API_URL}/restraunt/order-detail/?order_id=${order_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.data.length > 0) {
        const data = res.data[0];
        setOrderDetails(data);

        setCustomerLocation({
          latitude: parseFloat(data.customer_latitude),
          longitude: parseFloat(data.customer_longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
        setRestrauntLocation({
          latitude: parseFloat(data.restraunt_latitude),
          longitude: parseFloat(data.restraunt_longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });

        setOrderStatus(data.order_status)

        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const makeMapCenter = () => {
    mapRef.current.fitToCoordinates(
        [customerLocation, restrauntLocation],
        false
      );
  }

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
        >
          <FeatherIcon
            name="chevron-left"
            size={35}
            style={{ color: "#f78783" }}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Order</Text>
          <Text style={styles.subHeaderTitle}>Order Id : {order_id}</Text>
        </View>
      </View>
      <ScrollView>
        <MapView
          ref={mapRef}
          style={{
            height: 300,
            width: "100%",
          }}
          initialRegion={restrauntLocation}
          region={restrauntLocation}
          provider={PROVIDER_GOOGLE}
   
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
        </MapView>

        <View>
          <View>
            <Text>Delivery Status: {orderStatus}  </Text>
          </View>
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
    position: "relative",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  subHeaderTitle: {
    fontSize: 12,
    color: "#636363",
  },
});
