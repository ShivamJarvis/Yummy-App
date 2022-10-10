import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { authContext } from "../contexts/AuthContext";
import { API_URL } from "@env";
import axios from "axios";

const CartFloatComponent = () => {
  const navigation = useNavigation();
  const { accessToken, dishToCart,setCartRestrauntId } = authContext();
  const [cartDetails, setCartDetails] = useState({});
  const [itemCount, setItemCount] = useState(0);

  const getCartDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/restraunt/cart/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setCartDetails(res.data.data);
      var qty = 0;
      res.data.data.cart.map((item) => {
        qty += item.qty;
      });
      setItemCount(qty);

    if(res.data.data && res.data.data.restraunt){
        setCartRestrauntId(res.data.data.restraunt.id)
    }

    } catch (err) {}
  };
  useEffect(() => {
    if (dishToCart.status == false) {
      getCartDetails();
    }
  }, [dishToCart.status,accessToken]);

  if (itemCount == 0) {
    return null;
  }

  if (itemCount > 0) {
    return (
      <View style={styles.topContainer}>
        <View style={styles.detailContainer}>
          <View>
            <Text style={styles.mainText}>
              {itemCount} item | ₹{cartDetails?.cart_total}
            </Text>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>navigation.navigate("RestrauntDetailsScreen",{id:cartDetails?.restraunt?.id})}>

            <Text style={{ color: "#ffffff", fontSize: 13 }}>
              From {cartDetails?.restraunt?.name}
            </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("CartScreen")}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#ffffff",
              height: 40,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              zIndex: 99999,
            }}
          >
            <Text style={{ ...styles.mainText, color: "#774B52" }}>
              View Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default CartFloatComponent;

const styles = StyleSheet.create({
  topContainer: {
    height: 60,
    width: Dimensions.get("window").width - 20,
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000000",
    shadowOpacity: 10,
    backgroundColor: "#774B52",
    zIndex: 1,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 10,
    zIndex: 1,
  },
  mainText: {
    fontWeight: "700",
    color: "#ffffff",
    fontSize: 15,
  },
});
