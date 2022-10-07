import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import React, { useEffect, useRef, useState } from "react";
import MciIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { AirbnbRating } from "react-native-ratings";
import RBSheet from "react-native-raw-bottom-sheet";
import { authContext } from "../../contexts/AuthContext";
import AwesomeAlert from "react-native-awesome-alerts";
import axios from "axios";
import { API_URL } from "@env";

const DishCard = ({
  dish,
  isRestrauntOpen,
  restrauntId,
  cartReloading,
  setCartReloading,
  restrauntName,
}) => {
  let today = new Date();
  const {
    cart,
    setCart,
    deleteCart,
    cartRestrauntId,
    setCartRestrauntId,
    addItemToCart,
    removeItemToCart,
    serverCart,
    setServerCart,
    dishToCart,
    accessToken
  } = authContext();
  const [customisedItems, setCustomisedItems] = useState([]);
  const cutomizeRef = useRef();
  const addMoreCustomiseRef = useRef();
  const [isInCart, setIsInCart] = useState(null);

  const [showAlert, setshowAlert] = useState(false);
  const [iWillChoose, setIWillChoose] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  let currentTime = today.toLocaleTimeString("en-SE");

  const handleIsInCart = () => {
    if (serverCart == null) {
      return;
    }
    if (serverCart.cart) {
      serverCart?.cart.map((cart_item) => {
        if (cart_item.item.id == dish.id) {
          setIsInCart({
            itemId: dish.id,
            itemTotal: cart_item.item_total,
            qty: cart_item.qty,
            is_customisable: cart_item.item.is_customisable,
          });
        }
        return cart_item;
      });
      setCartReloading(true);
    }
  };

  useEffect(() => {
    if (serverCart || !dishToCart) {
      handleIsInCart();
    }
  }, [serverCart, dishToCart]);

  const handleAddDish = () => {
    if (cartRestrauntId && cartRestrauntId !== restrauntId) {
      setshowAlert(true);
      return;
    }

    setCartRestrauntId(restrauntId);

    if (isInCart == null) {
      const isAdded = addItemToCart(dish.id, restrauntId);
      if (isAdded) {
        setIsInCart({ ...isInCart, qty: 1 });
        setCartReloading(true);
      }
    }
  };

  const addQty = () => {
    const isAdded = addItemToCart(dish.id, restrauntId);
    if (isAdded) {
      setIsInCart({ ...isInCart, qty: parseInt(isInCart.qty) + 1 });
      setCartReloading(true);
    }
  };

  const removeQty = () => {
    const isRemoved = removeItemToCart(dish.id,restrauntId);
    if (isRemoved) {
      setIsInCart({ ...isInCart, qty: parseInt(isInCart.qty) - 1 });
      setCartReloading(true);
     
    }
  };

  const handleCustomisableDish = () => {
    if (cutomizeRef !== null) {
      cutomizeRef.current.open();
    }

    if (cart.restrauntId !== undefined && cart.restrauntId !== restrauntId) {
      setshowAlert(true);
      return;
    }
  };

  const repeatCustomisedOrder = () => {
    setIsInCart({ ...isInCart, qty: parseInt(isInCart.qty) + 1 });

    updateQty(0);
    addMoreCustomiseRef.current.close();
    setCartReloading(true);
  };

  const chooseAgainCustomisedOrder = () => {
    setIWillChoose(true);

    addMoreCustomiseRef.current.close();
    cutomizeRef.current.open();
  };

  const updateItem = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
     
      const item_data = { restrauntId: restrauntId, itemId: dish.id };

      const res = await axios.post(
        `${API_URL}/restraunt/cart/item/`,
        item_data,
        config
      );
      const data = res.data.data;
 
      if(res.data.message == "No Cart Item Found"){
        setIsInCart(null)
        return
      }
      setIsInCart({
        ...isInCart,
        itemTotal: data.item_total,
        qty: data.qty,
      });

      const currentServerCart = serverCart
      currentServerCart = currentServerCart.cart.map(item=>{
        if (cart_item.item.id == dish.id) {
          item.qty = data.qty
          item.itemTotal = data.item_total
        }
        return item
      })
      setServerCart(currentServerCart)

    } catch (err) {
    
    }
  };


  const handleAddCustomisedDish = () => {
    if (cartRestrauntId !== null && cartRestrauntId !== restrauntId) {
      setshowAlert(true);
      return;
    }
    const currentCart = cart;
    setCartRestrauntId(restrauntId);
    currentCart.restrauntId = restrauntId;
    currentCart.restrauntName = restrauntName;

    if (currentCart.cartItems == null) {
      currentCart.cartItems = [];
    }

    const currentItem = currentCart.cartItems.filter(
      ({ itemId }) => itemId == dish.id
    );

    if (currentItem.length > 0 && iWillChoose == false) {
      addMoreCustomiseRef.current.open();
      return;
    }

    if (currentItem.length > 0 && iWillChoose == true) {
      setIsInCart({ ...isInCart, qty: parseInt(isInCart.qty) + 1 });
      // updateQty(0);
      cutomizeRef.current.close();
      return;
    }

    if (currentItem.length == 0) {
      currentCart.cartItems = [
        {
          itemId: dish.id,
          qty: 1,
          is_customisable: true,
          itemTotal: dish.item_price,
          options: [{ item: [...customisedItems], uniqueId: uniqueId }],
        },
        ...currentCart.cartItems,
      ];
      setCart(currentCart);

      updateItem();

      cutomizeRef.current.close();
    }
    setCartReloading(true);
  };

  const updateCustomisedDishSelection = (is_checked, item_id, add_item_id) => {
    var currentCustomisedItem = customisedItems;
    currentCustomisedItem = currentCustomisedItem.map((item) => {
      item.custom_dish_head = item.custom_dish_head.map((add_item) => {
        if (item.id == item_id && add_item.id == add_item_id) {
          if (item.current_selected == null) {
            item.current_selected = 0;
          }

          add_item.select = false;
          if (is_checked == true) {
            add_item.select = true;
            item.current_selected = parseInt(item.current_selected) + 1;
            if (item.current_selected > item.max_selection) {
              item.current_selected = parseInt(item.current_selected) - 1;
              add_item.select = false;
            }
          } else {
            item.current_selected = parseInt(item.current_selected) - 1;
          }
        }
        return add_item;
      });
      return item;
    });

    setCustomisedItems(currentCustomisedItem);
  };

  useEffect(() => {
    if (cartReloading) {
      updateItem();
      setCartReloading(false);
    }
  }, [cartReloading]);

  useEffect(() => {
    if (dish.is_customisable) {
      const dishes = dish.dish;
      setUniqueId("id" + Math.random().toString(16).slice(2));
      setCustomisedItems(dishes);
    }
  }, [dish, iWillChoose]);

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
                      disabled={dishToCart}
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
                      {(dishToCart && isInCart.itemId == dish.id) ? (
                        <ActivityIndicator size={14} color="#FF6666" />
                      ) : (
                        isInCart.qty
                      )}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={
                        dish.is_customisable ? handleAddCustomisedDish : addQty
                      }
                      disabled={dishToCart}
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
        onClose={() => setIWillChoose(false)}
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
          {customisedItems.map((item, index) => {
            return (
              <View key={index} style={{ marginTop: index == 0 ? 0 : 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  {item.name} ({item.current_selected || 0} /{" "}
                  {item.max_selection})
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
                          fillColor={
                            item.current_selected == item.max_selection &&
                            !add_item.select
                              ? "#cecece"
                              : "#FF6666"
                          }
                          unfillColor={
                            item.current_selected == item.max_selection &&
                            !add_item.select
                              ? "#cecece"
                              : "#FFFFFF"
                          }
                          text={add_item.name}
                          iconStyle={{ borderColor: "red" }}
                          innerIconStyle={{ borderWidth: 2 }}
                          disableText={true}
                          disabled={
                            item.current_selected == item.max_selection &&
                            !add_item.select
                          }
                          isChecked={add_item.select}
                          onPress={(isChecked) => {
                            updateCustomisedDishSelection(
                              isChecked,
                              item.id,
                              add_item.id
                            );
                          }}
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

      <RBSheet
        ref={addMoreCustomiseRef}
        height={200}
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
            flex: 1,
          }}
        >
          Are you want to repeat?
        </Text>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={chooseAgainCustomisedOrder}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FF6666",
              paddingVertical: 10,
              marginHorizontal: 10,
              marginBottom: 10,
              borderRadius: 10,
              flex: 1,
            }}
          >
            <Text
              style={{ fontSize: 14, color: "#ffffff", textAlign: "center" }}
            >
              I'll Choose
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={repeatCustomisedOrder}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FF6666",
              paddingVertical: 10,
              marginHorizontal: 10,
              marginBottom: 10,
              borderRadius: 10,
              flex: 1,
            }}
          >
            <Text
              style={{ fontSize: 14, color: "#ffffff", textAlign: "center" }}
            >
              Repeat
            </Text>
          </TouchableOpacity>
        </View>
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
          setshowAlert(false);
        }}
        onConfirmPressed={() => {
          const currentCart = {};
          currentCart.restrauntId = restrauntId;
          currentCart.restrauntName = restrauntName;
          setCartRestrauntId(restrauntId);

          setCart(currentCart);
          deleteCart();
          setshowAlert(false);
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
