import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import React, { useEffect, useRef, useState } from "react";
import MciIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { AirbnbRating } from "react-native-ratings";
import RBSheet from "react-native-raw-bottom-sheet";
import { authContext } from "../../contexts/AuthContext";
import AwesomeAlert from 'react-native-awesome-alerts';


const DishCard = ({
  dish,
  isRestrauntOpen,
  restrauntId,
  cartReloading,
  setCartReloading,
  restrauntName
}) => {
  let today = new Date();
  const { cart, setCart, customisedItems, setCustomisedItems } = authContext();
  const cutomizeRef = useRef();
  const [isInCart, setIsInCart] = useState(null);
  const [showAlert, setshowAlert] = useState(false);
  let currentTime = today.toLocaleTimeString("en-SE");

  const handleCustomisableDish = () => {
    if (cutomizeRef !== null) {
      cutomizeRef.current.open();
    }

    if (cart.restrauntId !== undefined && cart.restrauntId !== restrauntId) {
      setshowAlert(true)
      return
    }

   
  };

  const updateItem = () => {
    if (cart.cartItems == null) {
      return;
    }
    const dishInCart = cart.cartItems.filter(({ itemId }) => itemId == dish.id);

    setIsInCart(dishInCart[0]);
  };

  const handleAddDish = () => {
    if (cart.restrauntId !== undefined && cart.restrauntId !== restrauntId) {
      setshowAlert(true)
      return
    }

    const currentCart = cart;
    currentCart.restrauntId = restrauntId;
    currentCart.restrauntName = restrauntName;

    if (currentCart.cartItems == null) {
      currentCart.cartItems = [];
    }

    const currentItem = currentCart.cartItems.filter(
      ({ itemId }) => itemId == dish.id
    );
    if (currentItem.length == 0) {
      currentCart.cartItems = [
        ...currentCart.cartItems,
        {
          itemId: dish.id,
          qty: 1,
          is_customisable: false,
          itemTotal: dish.item_price,
        },
      ];
      updateItem();
    }

    setCart(currentCart);
    setCartReloading(true);
  };

  const updateQty = (remove) => {
    const currentCart = cart;

    const currentItems = currentCart.cartItems.map((item) => {
      if (item.itemId == isInCart.itemId) {
        if (remove == 0) {
          return {
            ...item,
            qty: parseInt(item.qty) + 1,
            itemTotal: (parseInt(item.qty) + 1) * dish.item_price,
          };
        } else {
          return {
            ...item,
            qty: parseInt(item.qty) - 1,
            itemTotal: (parseInt(item.qty) - 1) * dish.item_price,
          };
        }
      } else {
        return item;
      }
    });

    currentCart.cartItems = currentItems;

    setCart(currentCart);
  };

  const addQty = () => {
    setIsInCart({ ...isInCart, qty: parseInt(isInCart.qty) + 1 });

    updateQty(0);
    setCartReloading(true);
  };

  const removeQty = () => {
    setIsInCart({ ...isInCart, qty: parseInt(isInCart.qty) - 1 });

    if (parseInt(isInCart.qty) - 1 == 0) {
      const currentCart = cart;
      currentCart.cartItems = currentCart.cartItems.filter(
        ({ itemId }) => itemId !== dish.id
      );
      setCart(currentCart);
      setIsInCart(null);
      setCartReloading(true);
      return;
    }

    updateQty(1);
    setCartReloading(true);
  };

  const handleAddCustomisedDish = () => {
    const currentCart = cart;
    currentCart.restrauntId = restrauntId;

    if (currentCart.cartItems == null) {
      currentCart.cartItems = [];
    }

    const currentItem = currentCart.cartItems.filter(
      ({ itemId }) => itemId == dish.id
    );
    if (currentItem.length == 0) {
      currentCart.cartItems = [
        ...currentCart.cartItems,
        {
          itemId: dish.id,
          qty: 1,
          is_customisable: true,
          itemTotal: dish.item_price,
        },
      ];
      updateItem();
      cutomizeRef.current.close();
    }
  };

  useEffect(() => {
    setCartReloading(false);
    updateItem();
  }, [cartReloading]);

  useEffect(() => {
    updateItem();
  }, []);

  return (
    <View>
      <View
        disabled={
          !(currentTime > dish.open_time && currentTime < dish.close_time)
        }
        activeOpacity={0.9}
        style={{
          borderTopWidth: 1,
          borderTopColor: "#cecece",
          paddingVertical: 14,
        }}
      >
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {dish.is_veg ? (
                <MciIcon
                  name="circle-box"
                  style={{ color: "#059610" }}
                  size={18}
                />
              ) : (
                <MciIcon
                  name="circle-box"
                  style={{ color: "#a80d02" }}
                  size={18}
                />
              )}

              {dish.is_bestseller && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <MciIcon
                    name="star-shooting"
                    size={14}
                    style={{ fontWeight: "700", color: "#FF6666" }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: "#FF6666",
                    }}
                  >
                    Bestseller
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              {dish.item_name}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 2 }}>
              ₹{dish.item_price}
            </Text>

            <View
              style={{
                marginTop: -20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AirbnbRating
                type="star"
                imageSize={18}
                showRating
                defaultRating={dish.rating}
                size={15}
                reviewSize={0}
                isDisabled={true}
              />
              <Text style={{ marginTop: 20, marginLeft: 5, fontWeight: "700" }}>
                {dish.rating}
              </Text>
              <Text style={{ marginTop: 20, marginLeft: 5 }}>
                ({dish.total_sell})
              </Text>
            </View>
          </View>

          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: dish.image }}
              style={{ height: 100, width: 110 }}
            />
          </View>

          {currentTime > dish.open_time &&
            currentTime < dish.close_time &&
            isRestrauntOpen && (
              <View
                style={{
                  position: "absolute",
                  bottom: -16,
                  right: isInCart ? 0 : 6,
                }}
              >
                {!isInCart ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (dish.is_customisable) {
                        handleCustomisableDish();
                      } else {
                        handleAddDish();
                      }
                    }}
                  >
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>Add</Text>

                    {dish.is_customisable && (
                      <Text style={{ color: "#e6e6e6", fontSize: 8 }}>
                        Customisable
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={removeQty}
                      style={{
                        backgroundColor: "#FF6666",
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 10,
                        marginHorizontal: 3,
                      }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 20 }}>-</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        backgroundColor: "#ffffff",
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}
                    >
                      {isInCart.qty}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={addQty}
                      style={{
                        backgroundColor: "#FF6666",
                        paddingHorizontal: 14,
                        paddingVertical: 7,
                        borderRadius: 10,
                        marginHorizontal: 3,
                      }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 20 }}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
        </View>
      </View>

      <RBSheet
        ref={cutomizeRef}
        height={Dimensions.get("window").height - 100}
        openDuration={250}
        customStyles={{
          container: {
            paddingHorizontal: 10,
            paddingTop: 10,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          Select Options
        </Text>
        <ScrollView>
          {dish.dish.map((item, index) => {
            return (
              <View key={index} style={{ marginTop: index == 0 ? 0 : 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  {item.name} (0 / {item.max_selection})
                </Text>
                {item.custom_dish_head.map((add_item) => {
                  return (
                    <View
                      key={add_item.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                        justifyContent: "space-between",
                        paddingHorizontal: 10,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <BouncyCheckbox
                          size={22}
                          fillColor="#FF6666"
                          unfillColor="#FFFFFF"
                          text={add_item.name}
                          iconStyle={{ borderColor: "red" }}
                          innerIconStyle={{ borderWidth: 2 }}
                          disableText={true}
                          onPress={(isChecked) => {}}
                        />
                        <Text style={{ marginLeft: 10 }}>{add_item.name}</Text>
                      </View>

                      <Text style={{ fontSize: 16 }}>₹ {add_item.price}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            backgroundColor: "#FF6666",
            paddingVertical: 10,
            marginHorizontal: 10,
            marginBottom: 10,
            borderRadius: 10,
          }}
          onPress={handleAddCustomisedDish}
        >
          <Text style={{ fontSize: 20, color: "#ffffff", textAlign: "center" }}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </RBSheet>

      <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Replace cart item?"
          message={`Your cart contains dishes from ${cart.restrauntName}. Do you want to discard the selection and add dishes from ${restrauntName}. `}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No"
      
          confirmText="Replace"
          confirmButtonColor="#FF6666"
          onCancelPressed={() => {
            setshowAlert(false)
          }}
          onConfirmPressed={() => {
            const currentCart = {};
            currentCart.restrauntId = restrauntId;
            currentCart.restrauntName = restrauntName;
            setCart(currentCart)
            setshowAlert(false)
          }}
        />
    </View>
  );
};

export default DishCard;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#FF6666",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 10,
  },
});
