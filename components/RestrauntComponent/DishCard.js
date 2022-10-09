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
import VegNonVegSymbol from "./VegNonVegSymbol";
import {useNavigation} from '@react-navigation/native'

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
    deleteCart,
    cartRestrauntId,
    setCartRestrauntId,
    addItemToCart,
    removeItemToCart,
    dishToCart,
    accessToken,
    addCustomisedItemToCart,
    removeCustomisedItemToCart,
    customisedIsNotRemoved,
    setCustomisedIsNotRemoved,
  } = authContext();
  const navigation = useNavigation()
  const [customisedItems, setCustomisedItems] = useState([]);
  const cutomizeRef = useRef();
  const addMoreCustomiseRef = useRef();
  const [isInCart, setIsInCart] = useState(null);

  const [showAlert, setshowAlert] = useState(false);
  const [iWillChoose, setIWillChoose] = useState(null);
  let currentTime = today.toLocaleTimeString("en-SE");

  const handleAddDish = async () => {
    if (cartRestrauntId && cartRestrauntId !== restrauntId) {
      setshowAlert(true);
      return;
    }

    setCartRestrauntId(restrauntId);

    if (isInCart == null) {
      const isAdded = await addItemToCart(dish.id, restrauntId);
      if (isAdded) {
        setIsInCart({ ...isInCart, qty: 1 });
        setCartReloading(true);
      }
    }
  };

  const addQty = async () => {
    const isAdded = await addItemToCart(dish.id, restrauntId);
    if (isAdded) {
      setCartReloading(true);
    }
  };

  const removeQty = async () => {
    const isRemoved = await removeItemToCart(dish.id, restrauntId);
    if (isRemoved) {
      setCartReloading(true);
    }
  };

  const openCustomisationBox = () => {
    if (cutomizeRef !== null) {
      cutomizeRef.current.open();
    }

    if (cartRestrauntId && cartRestrauntId !== restrauntId) {
      setshowAlert(true);
      return;
    }
  };

  const openAddCustomisationOptionsBox = () => {
    setIWillChoose(true);
    if (addMoreCustomiseRef !== null) {
      addMoreCustomiseRef.current.open();
    }
  };

  const handleAddCustomisedDish = async () => {
    setCartRestrauntId(restrauntId);
    var isAdded = await addCustomisedItemToCart(
      dish.id,
      restrauntId,
      customisedItems,
      false
    );
    setIWillChoose(false);
    if (isAdded) {
      setCartReloading(true);
      cutomizeRef.current.close();
    }
  };

  const removeCustomisedDishQty = async () => {
    const isRemoved = await removeCustomisedItemToCart(dish.id, restrauntId);
    if (isRemoved) {
      if (customisedIsNotRemoved) {
        return;
      }

      setCartReloading(true);
    }
  };

  const repeatCustomisedOrder = async () => {
    addMoreCustomiseRef.current.close();
    var isAdded = await addCustomisedItemToCart(
      dish.id,
      restrauntId,
      customisedItems,
      true
    );
    if (isAdded) {
      setCartReloading(true);
      cutomizeRef.current.close();
    }
  };

  const chooseAgainCustomisedOrder = () => {
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

      if (res.data.message == "No Cart Item Found") {
        setIsInCart(null);
        return;
      }
      setIsInCart({
     
        itemTotal: data.item_total,
        qty: data.qty,
      });
    } catch (err) {}
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

  const getCustomisationOptionsForDish = async () => {
    const res = await axios.get(
      `${API_URL}/restraunt/custom-dish-head/?menu_dish=${dish.id}`
    );
    const data = res.data;
    setCustomisedItems(data);
  };

  useEffect(() => {
    if (dish.is_customisable) {
      getCustomisationOptionsForDish();
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
              <VegNonVegSymbol is_veg={dish.is_veg} />

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
                        openCustomisationBox();
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
                      disabled={dishToCart.status}
                      onPress={
                        dish.is_customisable
                          ? removeCustomisedDishQty
                          : removeQty
                      }
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
                      {dishToCart.status && dishToCart.itemId == dish.id ? (
                        <ActivityIndicator size={14} color="#FF6666" />
                      ) : (
                        isInCart.qty
                      )}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={
                        dish.is_customisable
                          ? openAddCustomisationOptionsBox
                          : addQty
                      }
                      disabled={dishToCart.status}
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
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}
      >
        <View
          style={{
            backgroundColor: "#f1f1f1",
            flex: 1,
            width: "100%",
            marginBottom: 10,
          }}
        >
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#6b6969",

                marginTop: 10,
              }}
            >
              {dish.item_name}
            </Text>
            <Text
              style={{
                fontSize: 22,
                color: "#242323",
                fontWeight: "700",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              Select options
            </Text>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 10,
            }}
          />

          <ScrollView style={{ marginHorizontal: 10 }}>
            {customisedItems.map((item, index) => {
              return (
                <View key={index} style={{ marginTop: index == 0 ? 0 : 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    {item.name} ({item.current_selected || 0} /{" "}
                    {item.max_selection})
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: 20,
                      padding: 10,
                      marginTop: 10,
                    }}
                  >
                    {item.custom_dish_head.map((add_item) => {
                      return (
                        <View
                          key={add_item.id}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 10,
                            justifyContent: "space-between",
                            paddingHorizontal: 8,
                            marginBottom: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <VegNonVegSymbol is_veg={dish.is_veg} />

                            <Text style={{ marginLeft: 10 }}>
                              {add_item.name}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 16, marginRight: 10 }}>
                              ₹ {add_item.price}
                            </Text>
                            <BouncyCheckbox
                              size={24}
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
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
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
        height={190}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}
      >
        <View
          style={{
            backgroundColor: "#f1f1f1",
            flex: 1,
            width: "100%",
            marginBottom: 10,
          }}
        >
          <View style={{ marginHorizontal: 20, flex: 1, marginTop: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#6b6969",

                marginTop: 10,
              }}
            >
              {dish.item_name}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "#242323",
                fontWeight: "700",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              Repeat Previous Customisation?
            </Text>

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
            onPress={chooseAgainCustomisedOrder}
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
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#ffffff",
                textAlign: "center",
              }}
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
        message={`Your cart contains dishes from another restraunt. Do you want to discard the selection and add dishes from ${restrauntName}. `}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelButtonStyle={styles.cancelButtonStyle}
        cancelButtonTextStyle={styles.cancelButtonTextStyle}
        confirmButtonTextStyle={styles.confirmButtonTextStyle}
        confirmButtonStyle={styles.confirmButtonStyle}
        titleStyle={styles.titleStyle}
        messageStyle={styles.messageStyle}
        contentContainerStyle={styles.contentContainerStyle}
        cancelText="No"
        confirmText="Replace"
        confirmButtonColor="#FF6666"
        onCancelPressed={() => {
          setshowAlert(false);
        }}
        onConfirmPressed={() => {
          setCartRestrauntId(restrauntId);
          deleteCart();
          setshowAlert(false);
        }}
      />

      <AwesomeAlert
        show={customisedIsNotRemoved}
        showProgress={false}
        title="Remove item from cart?"
        message={`This item has multiple customisations added. Proceed to cart to remove item?`}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelButtonStyle={styles.cancelButtonStyle}
        cancelButtonTextStyle={styles.cancelButtonTextStyle}
        confirmButtonTextStyle={styles.confirmButtonTextStyle}
        confirmButtonStyle={styles.confirmButtonStyle}
        titleStyle={styles.titleStyle}
        messageStyle={styles.messageStyle}
        contentContainerStyle={styles.contentContainerStyle}
        cancelText="No"
        confirmText="Yes"
        confirmButtonColor="#FF6666"
        onCancelPressed={() => {
          setCustomisedIsNotRemoved(false);
        }}
        onConfirmPressed={() => {
          navigation.navigate("CartScreen")
          setCustomisedIsNotRemoved(false);
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

  cancelButtonStyle: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#ffd1d1",
    borderRadius: 20,
  },
  cancelButtonTextStyle: {
    color: "#FF6666",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonTextStyle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonStyle: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 20,
  },
  titleStyle: {
    fontSize: 19,

    color: "#000000",
    fontWeight: "bold",
  },
  messageStyle: {
    fontSize: 14,
  },

  contentContainerStyle: {
    borderRadius: 20,
  },
});
