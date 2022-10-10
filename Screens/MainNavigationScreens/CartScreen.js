import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { authContext } from "../../contexts/AuthContext";
import { API_URL } from "@env";
import LoadingComponent from "./../../components/LoadingComponent";
import FooterComponent from "./../../components/FooterComponent";
import { getDistance } from "geolib";
import SelectDropdown from "react-native-select-dropdown";
import CartItemCard from "../../components/CartComponents/CartItemCard";
import FeatherIcon from "react-native-vector-icons/Feather";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

const CartScreen = ({ navigation }) => {
  const { accessToken, location, user } = authContext();
  const [cartDetails, setCartDetails] = useState({});
  const [cartReloading, setCartReloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(0.0);
  const [distance, setDistance] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const getUserAddressDetails = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/user/address-details/?user=${user.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // var restrauntLocation = {
      //   latitude: restrauntCart?.restraunt?.latitude,
      //   longitude: restrauntCart?.restraunt?.longitude,
      // };

      // res.data.filter(item=>{
      //   const addressLocation = {
      //     latitude: item.latitude,
      //     longitude: item.longitude,
      //   };
      //   var distance = getDistance(restrauntLocation, addressLocation) / 1000;
      //   if (distance <= restrauntCart?.restraunt?.maximum_delivery_radius) {
      //     return item
      //   }
      // })

      setUserAddresses(res.data);

      const customerLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      res.data.map((data) => {
        const addressLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
        };

        var distance = getDistance(customerLocation, addressLocation);
        if (distance <= 150) {
          setSelectedAddress(data);
        }
      });
    } catch (err) {}
  };

  const handleDeliveryTime = (restrauntCart) => {
    var dishPreparationTime = 0
    restrauntCart?.cart?.map(item=>{
      dishPreparationTime += item.item.preparation_time
    })
  }

  const handleDeliveryCharges = (restrauntCart) => {
    if (restrauntCart == {}) {
      return;
    }
    if (selectedAddress) {
      const addressLocation = {
        latitude: selectedAddress?.latitude,
        longitude: selectedAddress?.longitude,
    };

    handleDeliveryTime(restrauntCart)


      var restrauntLocation = {
        latitude: restrauntCart?.restraunt?.latitude,
        longitude: restrauntCart?.restraunt?.longitude,
      };
      var distance = getDistance(addressLocation, restrauntLocation);

      setDistance(distance / 1000);
      if (distance / 1000 > 3) {
        setDeliveryCharge((distance / 1000) * 5);
        setCartTotal(
          Math.round(
            (restrauntCart?.cart_total * 5) / 100 +
              restrauntCart?.cart_total +
              (distance / 1000) * 5
          )
        );
        return
      }
      setCartTotal(
        Math.round(
          (restrauntCart?.cart_total * 5) / 100 + restrauntCart?.cart_total
        )
      );
      return
    }
    setCartTotal(
      Math.round(
        (restrauntCart?.cart_total * 5) / 100 + restrauntCart?.cart_total
      )
    );
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
    if (selectedAddress) {
      handleDeliveryCharges(cartDetails);
    }
  }, [selectedAddress]);

  useEffect(() => {
    getUserAddressDetails();
  }, [user, accessToken]);

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

      <ScrollView style={{ backgroundColor: "#ffffff" }}>
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
            <TouchableOpacity style={styles.buttonStyle}>
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
                style={{ ...styles.buttonStyle, flex: 1, marginHorizontal: 2 }}
              >
                <Text
                  style={{ ...styles.mainText, color: "#ffffff", fontSize: 12 }}
                >
                  Add New Address
                </Text>
              </TouchableOpacity>

              <SelectDropdown
                data={userAddresses}
                defaultButtonText="Choose Address"
                buttonTextStyle={{
                  ...styles.mainText,
                  color: "#ffffff",
                  fontSize: 12,
                }}
                buttonStyle={{
                  ...styles.buttonStyle,
                  flex: 1,
                  marginHorizontal: 10,
                }}
                selectedRowTextStyle={{ color: "#000000" }}
                rowTextStyle={{ fontSize: 13 }}
                defaultValue={selectedAddress}
                onSelect={(selectedItem, index) => {
                  setSelectedAddress(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected

                  if (selectedAddress.address_type == "Home") {
                    return (
                      <FeatherIcon name="home" color={"#f78783"} size={20} />
                    );
                  }
                  if (selectedAddress.address_type == "Work") {
                    return (
                      <MCIcon
                        name="office-building-marker-outline"
                        color={"#f78783"}
                        size={20}
                      />
                    );
                  }

                  return selectedItem.address_type;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item.address_type;
                }}
              />
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
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Deliver to {selectedAddress.address_type} | 29 Mins
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 12, color: "#7e7e7e" }}
                >
                  {selectedAddress.address_line_1},{" "}
                  {selectedAddress.address_line_2},{" "}
                  {selectedAddress.address_line_3}
                </Text>
              </View>

              <SelectDropdown
                data={userAddresses}
                buttonStyle={{
                  width: 100,
                  height: 45,
                  backgroundColor: "#ffffff",
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#cecece",
                }}
                selectedRowTextStyle={{ color: "#000000" }}
                rowTextStyle={{ fontSize: 13 }}
                renderDropdownIcon={() => <FeatherIcon name="chevron-down" />}
                defaultValue={selectedAddress}
                onSelect={(selectedItem, index) => {
                  setSelectedAddress(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected

                  if (selectedAddress.address_type == "Home") {
                    return (
                      <FeatherIcon name="home" color={"#f78783"} size={20} />
                    );
                  }
                  if (selectedAddress.address_type == "Work") {
                    return (
                      <MCIcon
                        name="office-building-marker-outline"
                        color={"#f78783"}
                        size={20}
                      />
                    );
                  }

                  return selectedItem.address_type;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item.address_type;
                }}
              />
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

          <TouchableOpacity activeOpacity={0.8} style={styles.buttonStyle}>
            <Text style={{ ...styles.mainText, color: "#ffffff" }}>
              Proceed to Pay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
});
