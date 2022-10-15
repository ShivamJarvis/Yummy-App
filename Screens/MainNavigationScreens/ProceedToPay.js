import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";
import Fa5Icon from "react-native-vector-icons/FontAwesome5";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MiIcon from "react-native-vector-icons/MaterialIcons";
import { authContext } from "../../contexts/AuthContext";
import FooterComponent from "../../components/FooterComponent";
import axios from "axios";
import { API_URL } from "@env";
import LoadingComponent from "../../components/LoadingComponent";

const ProceedToPay = ({ navigation, route }) => {
  const {
    cartTotal,
    couponDiscount,
    deliveryCharge,
    partnerTipAmount,
    cartDetails,
    distance,
    deliveryTime,
  } = route.params;
  const { selectedAddress, accessToken,setCart,setCartRestrauntId,setOrderPlaced } = authContext();
  const [isLoading,setIsLoading] = useState(false)
  const createNewOrder = async () => {
    setIsLoading(true)
    try {

      const res = await axios.post(
        `${API_URL}/restraunt/order/`,
        {
          restraunt_id: cartDetails.restraunt.id,
          order_net_amount:
            cartTotal + deliveryCharge + partnerTipAmount - couponDiscount,
          order_tax_amount: (cartTotal * 5) / 100,
          order_tip_amount: partnerTipAmount,
          order_delivery_amount: deliveryCharge,
          order_discount_amount: couponDiscount,
          restraunt_latitude: cartDetails.restraunt.latitude,
          restraunt_longitude: cartDetails.restraunt.longitude,
          customer_latitude: selectedAddress.latitude,
          customer_longitude: selectedAddress.longitude,
          is_cod: true,
          item_count: cartDetails.cart.length,
          delivery_distance: distance,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.status == "success") {
        setOrderPlaced(true)
        setOrderPlaced(false)
        setCart({})
        setCartRestrauntId(null)
        setIsLoading(false)
        navigation.navigate("ActiveOrderDetailScreen", {
          order_id: res.data.order_id,
        });
      }
      setIsLoading(false)
    } catch (err) {
      console.log(err);
      setIsLoading(false)
    }
    
  };

  if(isLoading){
    return <LoadingComponent />
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
          <Text style={styles.headerTitle}>Payment Options</Text>
          <Text style={styles.subHeaderTitle}>
            {cartDetails.cart.length} item {"\u25CF"} Total: ₹
            {cartTotal + deliveryCharge + partnerTipAmount - couponDiscount}{" "}
          </Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.destinationContainer}>
          <Fa5Icon name="route" size={25} color={"#ff6666"} />
          <View>
            <View style={{ paddingHorizontal: 10 }}>
              <Text numberOfLines={1} style={styles.originDestinationText}>
                <Text style={{ color: "#000000" }}>
                  {cartDetails.restraunt.name}{" "}
                </Text>
                | Delivery in: {deliveryTime} mins
              </Text>
              <Text numberOfLines={1} style={styles.originDestinationText}>
                <Text style={{ color: "#000000" }}>
                  {selectedAddress.address_type}{" "}
                </Text>
                | {selectedAddress.address_line_1},
                {selectedAddress.address_line_2}, {selectedAddress.zip_code}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginHorizontal: 10, marginTop: 40 }}>
          <Text style={{ fontWeight: "700", fontSize: 15 }}>Bill Details</Text>

          <View style={styles.floatContainer}>
            <View style={styles.billingLine}>
              <Text style={{ color: "#1c1c1c" }}>Item Total</Text>
              <Text style={{ fontWeight: "700" }}>
                ₹{cartDetails?.cart_total}
              </Text>
            </View>

            {selectedAddress ? (
              <View style={styles.billingLine}>
                <Text style={{ color: "#1c1c1c" }}>
                  Delivery Fees | {distance.toPrecision(2)} Kms
                </Text>
                <Text style={{ fontWeight: "700" }}>₹{deliveryCharge}</Text>
              </View>
            ) : (
              <Text
                style={{ color: "#1c1c1c", marginLeft: 10, fontWeight: "700" }}
              >
                Please select address to calculate delivery fee
              </Text>
            )}

            {partnerTipAmount > 0 && (
              <View style={styles.billingLine}>
                <Text style={{ color: "#1c1c1c" }}>Tip Amount</Text>
                <Text style={{ fontWeight: "700" }}>₹{partnerTipAmount}</Text>
              </View>
            )}

            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderStyle: "dashed",
                marginVertical: 10,
              }}
            ></View>

            <View style={styles.billingLine}>
              <Text style={{ color: "#1c1c1c" }}>Taxes and Charges</Text>
              <Text style={{ fontWeight: "700" }}>
                ₹{Math.round((cartDetails?.cart_total * 5) / 100)}
              </Text>
            </View>

            {couponDiscount > 0 && (
              <View style={styles.billingLine}>
                <Text style={{ color: "#1c1c1c" }}>Coupon Discount</Text>
                <Text style={{ fontWeight: "700" }}>₹{couponDiscount}</Text>
              </View>
            )}

            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderStyle: "dashed",
                marginVertical: 10,
              }}
            ></View>

            <View style={styles.billingLine}>
              <Text style={{ fontWeight: "700" }}>To Pay</Text>
              <Text style={{ fontWeight: "700" }}>
                ₹{cartTotal + partnerTipAmount - couponDiscount}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginHorizontal: 10, marginTop: 20 }}>
          <Text style={{ fontWeight: "700", fontSize: 15 }}>
            Payment Options
          </Text>

          <View style={styles.floatContainer}>
            <TouchableOpacity
              style={{ marginVertical: 10 }}
              onPress={createNewOrder}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.paymentOption}>
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 5,
                      borderRadius: 10,
                      borderColor: "#cecece",
                      marginRight: 10,
                    }}
                  >
                    <MCIcon name="cash" size={22} color="#5c5c5c" />
                  </View>

                  <View>
                    <Text style={styles.paymentOptionHeading}>
                      Pay on Delivery
                    </Text>
                    <Text style={styles.paymentOptionSubHeading}>
                      Pay with cash
                    </Text>
                  </View>
                </View>
                <FeatherIcon name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>

            <View
              style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            ></View>

            <TouchableOpacity style={{ marginVertical: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.paymentOption}>
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 5,
                      borderRadius: 10,
                      borderColor: "#cecece",
                      marginRight: 10,
                    }}
                  >
                    <MiIcon name="payment" size={22} color="#5c5c5c" />
                  </View>

                  <View>
                    <Text style={styles.paymentOptionHeading}>Pay Online</Text>
                    <Text style={styles.paymentOptionSubHeading}>
                      Pay with Paytm
                    </Text>
                  </View>
                </View>
                <FeatherIcon name="chevron-right" size={22} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProceedToPay;

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
  destinationContainer: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomRightRadius: 15,
    elevation: 1,
    alignItems: "center",
  },
  originDestinationText: {
    color: "#636363",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 5,
  },
  floatContainer: {
    backgroundColor: "#ffffff",
    elevation: 20,
    shadowColor: "#000000",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  billingLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  paymentOptionHeading: {
    fontWeight: "700",
    fontSize: 15,
  },
  paymentOptionSubHeading: {
    fontSize: 12,
    color: "#363636",
  },
});
