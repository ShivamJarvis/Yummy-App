import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
} from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { authContext } from "../../contexts/AuthContext";
import { API_URL } from "@env";
import LoadingComponent from "./../../components/LoadingComponent";
import FooterComponent from "./../../components/FooterComponent";
import { getDistance } from "geolib";
import CartItemCard from "../../components/CartComponents/CartItemCard";
import FeatherIcon from "react-native-vector-icons/Feather";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import SelectAddress from "../../components/SelectAddress";
import DeliveryPartnerTip from "../../components/CartComponents/DeliveryPartnerTip";
import DiscountSheet from "../../components/CartComponents/DiscountSheet";
import ErrorOrEmptyComponent from "../../components/ErrorOrEmptyComponent";

const CartScreen = ({ navigation }) => {
  const { accessToken, selectedAddress, userAddresses } = authContext();
  const newAddressSheetRef = useRef();
  const discountSheetRef = useRef();
  const [cartDetails, setCartDetails] = useState({});
  const [cartReloading, setCartReloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(0.0);
  const [distance, setDistance] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [partnerTipAmount, setPartnerTipAmount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountCoupons, setDiscountCoupons] = useState([]);
  const [isRestrauntOpen, setRestrauntOpen] = useState(false);
  let today = new Date();
  let currentTime = today.toLocaleTimeString("en-SE");

  var dishPreparationTime = 0;
  const handleDeliveryTime = (restrauntCart, calculatedDistance) => {
    var uniqueItems = [];
    restrauntCart?.cart?.map((item) => {
      if (!uniqueItems.includes(item.item.id)) {
        dishPreparationTime += item.item.preparation_time;
        uniqueItems.push(item.item.id);
      }
    });

    var calculatedDeliveryTime = dishPreparationTime + calculatedDistance * 3;
    if (calculatedDeliveryTime <= 35) {
      calculatedDeliveryTime = 35;
    }

    setDeliveryTime(calculatedDeliveryTime);
  };

  const handleDeliveryCharges = (restrauntCart) => {
    try {
      if (restrauntCart == {}) {
        return;
      }
      if (selectedAddress) {
        const addressLocation = {
          latitude: selectedAddress?.latitude,
          longitude: selectedAddress?.longitude,
        };

        var restrauntLocation = {
          latitude: restrauntCart?.restraunt?.latitude,
          longitude: restrauntCart?.restraunt?.longitude,
        };
        var calculatedDistance = getDistance(
          addressLocation,
          restrauntLocation
        );

        handleDeliveryTime(restrauntCart, calculatedDistance / 1000);

        setDistance(calculatedDistance / 1000);
        if (calculatedDistance / 1000 > 3) {
          setDeliveryCharge(Math.round((calculatedDistance / 1000) * 5));
          setCartTotal(
            Math.round(
              (restrauntCart?.cart_total * 5) / 100 +
                restrauntCart?.cart_total +
                (calculatedDistance / 1000) * 5
            )
          );
          return;
        }
        setCartTotal(
          Math.round(
            (restrauntCart?.cart_total * 5) / 100 + restrauntCart?.cart_total
          )
        );
        return;
      }
      setCartTotal(
        Math.round(
          (restrauntCart?.cart_total * 5) / 100 + restrauntCart?.cart_total
        )
      );
    } catch (err) {}
  };

  const getCartDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/restraunt/cart/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCartDetails(res.data.data);
      setLoading(false);
      handleDeliveryCharges(res.data.data);

      const coupon_res = await axios.get(
        `${API_URL}/restraunt/discount-coupon/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (coupon_res.data.status == "success") {
        setDiscountCoupons(coupon_res.data.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    getCartDetails();
    setCartReloading(false);
  }, [cartReloading]);

  useEffect(() => {
    if (selectedAddress && cartDetails) {
      handleDeliveryCharges(cartDetails);
    }
  }, [selectedAddress, cartDetails]);

  const openChooseAddressSheet = () => {
    if (newAddressSheetRef !== null) {
      newAddressSheetRef.current.open();
    }
  };

  const checkIsRestrauntOpen = () => {
    if (cartDetails === {}) {
      return
    }
    if(currentTime >= cartDetails?.restraunt?.opening_timing && currentTime < cartDetails?.restraunt?.closing_timing){
      setRestrauntOpen(true)
    }
    else{
      setRestrauntOpen(false)
    }

  };

  useEffect(()=>{
    if(cartDetails!=={}){
      checkIsRestrauntOpen()
    }
  },[cartDetails])

  if (loading) {
    return <LoadingComponent />;
  }

  if(cartDetails !== {}){
    if(cartDetails.cart.length == 0){
      return <ErrorOrEmptyComponent iconName={"shopping-cart"} title={"Cart is empty"} subTitle={"Hit the below button to fill your cart with delicious dishes."} headerText={"Cart"} buttonText={"Start Ordering"} screenName={"HomeScreen"} />
    }
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
        <Text style={styles.headerTitle}>{cartDetails?.restraunt?.name}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#ffffff" }}
      >
         {!isRestrauntOpen && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={require("./../../assets/images/closed.gif")}
              style={{ width: 120, height: 120 }}
            />
          </View>
        )}

        <View style={styles.cartItemsContainer}>
          {cartDetails.cart?.map((item) => (
            <CartItemCard
              item={item}
              cartReloading={cartReloading}
              setCartReloading={setCartReloading}
              restrauntId={cartDetails?.restraunt?.id}
              key={item.id}
            />
          ))}

          <View
            style={{
              borderBottomWidth: 1,
              borderStyle: "dashed",
              borderBottomColor: "#000000",
              marginTop: 15,
            }}
          ></View>
          <TextInput
            placeholder="Write instructions for restraunt"
            cursorColor="#ff6666"
            multiline={true}
            numberOfLines={3}
            maxLength={80}
          />
        </View>


       

        <View style={{ marginHorizontal: 10, marginTop: 20 }}>
          <Text style={{ fontWeight: "700", fontSize: 15 }}>
            Offers & Benefits
          </Text>

          <View style={styles.floatContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => discountSheetRef.current.open()}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text style={{ fontWeight: "700" }}>
                  {selectedCoupon ? selectedCoupon.code : "Apply Coupon"}
                </Text>
                <IonIcon name="chevron-forward" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginHorizontal: 10, marginTop: 20 }}>
          <Text style={{ fontWeight: "700", fontSize: 15 }}>
            Tip your Delivery Partner!
          </Text>

          <View style={styles.floatContainer}>
            <Text style={{ fontSize: 13, color: "#7e7e7e", fontWeight: "700" }}>
              Thank your delivery partner by leaving them a tip. 100% of the tip
              will go to your delivery partner.
            </Text>
            <DeliveryPartnerTip
              setCartTotal={setCartTotal}
              partnerTipAmount={partnerTipAmount}
              setPartnerTipAmount={setPartnerTipAmount}
            />
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

        <FooterComponent />
      </ScrollView>

      {/* Proceed To Checkout bottom Area */}
      <View style={styles.topContainer}>
        {userAddresses.length == 0 && (
          <View>
            <Text
              style={{ fontSize: 16, fontWeight: "700", marginVertical: 20 }}
            >
              Please add your complete address
            </Text>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => newAddressSheetRef.current.open()}
            >
              <Text style={{ ...styles.mainText, color: "#ffffff" }}>
                Add Address Detail
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {userAddresses.length > 0 && !selectedAddress && (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                marginVertical: 20,
                textAlign: "center",
              }}
            >
              Seem you are at new location!
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TouchableOpacity
                onPress={() => newAddressSheetRef.current.open()}
                style={{ ...styles.buttonStyle, flex: 1, marginHorizontal: 2 }}
              >
                <Text
                  style={{ ...styles.mainText, color: "#ffffff", fontSize: 12 }}
                >
                  Choose / Add New Address
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {userAddresses.length > 0 && selectedAddress && (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 10,
              }}
            >
              <View style={{ flex: 1, marginTop: 20 }}>
                {distance <= cartDetails?.restraunt?.maximum_delivery_radius ? (
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    Deliver to {selectedAddress.address_type} |{" "}
                    {Math.ceil(deliveryTime)} Mins
                  </Text>
                ) : (
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>
                    Unserviceable
                  </Text>
                )}
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 12, color: "#7e7e7e" }}
                >
                  {selectedAddress.address_line_1},{" "}
                  {selectedAddress.address_line_2},{" "}
                  {selectedAddress.address_line_3}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={openChooseAddressSheet}
              >
                <View style={styles.selectedAddressContainer}>
                  {selectedAddress.address_type == "Home" && (
                    <IonIcon name="home-sharp" color={"#f78783"} size={22} />
                  )}
                  {selectedAddress.address_type == "Work" && (
                    <MCIcon
                      name="office-building-marker-outline"
                      color={"#f78783"}
                      size={22}
                    />
                  )}
                  {selectedAddress.address_type == "Friends & Family" && (
                    <FAIcon name="users" color={"#f78783"} size={22} />
                  )}
                  {selectedAddress.address_type == "Other" && (
                    <FAIcon name="location-arrow" color={"#f78783"} size={22} />
                  )}
                  <FeatherIcon name="chevron-down" size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: 10,
            borderStyle: "dashed",
          }}
        ></View>

        <View style={styles.detailContainer}>
          <View>
            <Text style={styles.mainText}>
              ₹{cartTotal + partnerTipAmount - couponDiscount}
            </Text>
          </View>

          {distance <= cartDetails?.restraunt?.maximum_delivery_radius && isRestrauntOpen && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonStyle}
              onPress={() => {
                navigation.navigate("ProceedToPay", {
                  cartTotal: cartTotal,
                  couponDiscount: couponDiscount,
                  deliveryCharge: deliveryCharge,
                  partnerTipAmount: partnerTipAmount,
                  cartDetails: cartDetails,
                  deliveryTime: deliveryTime,
                  distance: distance,
                });
              }}
            >
              <Text style={{ ...styles.mainText, color: "#ffffff" }}>
                Proceed to Pay
              </Text>
            </TouchableOpacity>
          )}
          {!isRestrauntOpen && <Text style={styles.mainText}>Unserviceable</Text>}
        </View>
      </View>

      <SelectAddress newAddressSheetRef={newAddressSheetRef} />
      <DiscountSheet
        discountSeetRef={discountSheetRef}
        discountCoupons={discountCoupons}
        setCouponDiscount={setCouponDiscount}
        cartTotal={cartTotal - deliveryCharge}
        setSelectedCoupon={setSelectedCoupon}
        selectedCoupon={selectedCoupon}
      />
    </SafeAreaView>
  );
};

export default CartScreen;

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
  cartItemsContainer: {
    width: Dimensions.get("window").width - 20,
    borderRadius: 10,
    minHeight: 50,
    backgroundColor: "#ffffff",
    alignSelf: "center",

    marginVertical: 20,
    elevation: 20,
    shadowColor: "#000000",
    paddingHorizontal: 10,
    paddingVertical: 10,
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

  topContainer: {
    minHeight: 60,
    width: Dimensions.get("window").width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    elevation: 1,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    alignItems: "center",
    paddingTop: 10,
  },
  mainText: {
    fontWeight: "700",
    color: "#000000",
    fontSize: 16,
  },
  buttonStyle: {
    backgroundColor: "#774B52",
    height: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  selectedAddressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderColor: "#cecece",
  },
});
