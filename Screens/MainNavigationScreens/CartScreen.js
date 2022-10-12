import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { authContext } from "../../contexts/AuthContext";
import { API_URL } from "@env";
import LoadingComponent from "./../../components/LoadingComponent";
import FooterComponent from "./../../components/FooterComponent";
import { getDistance } from "geolib";
import CartItemCard from "../../components/CartComponents/CartItemCard";
import FeatherIcon from "react-native-vector-icons/Feather";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";

const CartScreen = ({ navigation }) => {
  const { accessToken, selectedAddress,setGlobalCoordinates, setSelectedAddress, userAddresses } =
    authContext();
  const newAddressSheetRef = useRef();
  const [cartDetails, setCartDetails] = useState({});
  const [cartReloading, setCartReloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(0.0);
  const [distance, setDistance] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0);

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
    if (calculatedDeliveryTime <= 35){
      calculatedDeliveryTime = 35
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
          setDeliveryCharge((calculatedDistance / 1000) * 5);
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

  if (loading) {
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
          <Icon name="chevron-left" size={35} style={{ color: "#f78783" }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{cartDetails?.restraunt?.name}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#ffffff" }}
      >
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

            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginVertical: 10,
              }}
            ></View>

            <View style={styles.billingLine}>
              <Text style={{ color: "#1c1c1c" }}>Taxes and Charges</Text>
              <Text style={{ fontWeight: "700" }}>
                ₹{Math.round((cartDetails?.cart_total * 5) / 100)}
              </Text>
            </View>

            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginVertical: 10,
              }}
            ></View>

            <View style={styles.billingLine}>
              <Text style={{ fontWeight: "700" }}>To Pay</Text>
              <Text style={{ fontWeight: "700" }}>₹{cartTotal}</Text>
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
          }}
        ></View>

        <View style={styles.detailContainer}>
          <View>
            <Text style={styles.mainText}>₹{cartTotal}</Text>
          </View>

          {distance <= cartDetails?.restraunt?.maximum_delivery_radius && (
            <TouchableOpacity activeOpacity={0.8} style={styles.buttonStyle}>
              <Text style={{ ...styles.mainText, color: "#ffffff" }}>
                Proceed to Pay
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <RBSheet
        ref={newAddressSheetRef}
       
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            minHeight:10
          },
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            flex: 1,
            width: "100%",
            marginBottom: 10,
          }}
        >
          <View style={{ marginHorizontal: 20, flex: 1, marginTop: 10 }}>
            <Text
              style={{
                fontSize: 20,
                color: "#242323",
                fontWeight: "700",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              Choose a delivery address
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {userAddresses &&
                userAddresses.map((address) => {
                  return (
                    <TouchableOpacity
                      key={address.id}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedAddress(address);
                        setGlobalCoordinates({'latitude':address.latitude,'longitude':address.longitude})
                        newAddressSheetRef.current.close();
                      }}
                      style={{marginBottom:10}}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          margin: 5,
                        }}
                      >
                        {address.address_type == "Home" && (
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: "#cecece",
                              borderRadius: 5,
                              padding: 5,
                              marginRight: 10,
                            }}
                          >
                            <IonIcon
                              name="home-sharp"
                              color={"#f78783"}
                              size={22}
                            />
                          </View>
                        )}
                        {address.address_type == "Work" && (
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: "#cecece",
                              borderRadius: 5,
                              padding: 5,
                              marginRight: 10,
                            }}
                          >
                            <MCIcon
                              name="office-building-marker-outline"
                              color={"#f78783"}
                              size={22}
                            />
                          </View>
                        )}
                        {address.address_type == "Friends & Family" && (
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: "#cecece",
                              borderRadius: 5,
                              padding: 5,
                              marginRight: 10,
                            }}
                          >
                            <FAIcon name="users" color={"#f78783"} size={22} />
                          </View>
                        )}
                        {address.address_type == "Other" && (
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: "#cecece",
                              borderRadius: 5,
                              padding: 5,
                              marginRight: 10,
                            }}
                          >
                            <FAIcon name="location-arrow" color={"#f78783"} size={22} />
                          </View>
                        )}
                        <View>
                          <Text style={{ fontWeight: "700" }}>
                            {address.address_type}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={{ fontSize: 12, color: "#7e7e7e" }}
                          >
                            {address.address_line_1}, {address.address_line_2},{" "}
                            {address.address_line_3}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            marginBottom: 10,
       
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddAddressScreen");
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#FF6666",
              borderWidth: 1,
              paddingVertical: 10,
              marginHorizontal: 10,
              marginBottom: 10,
              borderRadius: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#FF6666",
                textAlign: "center",
              }}
            >
              Add New Address
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
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
