import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import VegNonVegSymbol from "../RestrauntComponent/VegNonVegSymbol";
import { authContext } from "../../contexts/AuthContext";
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";
import { API_URL } from "@env";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const CartItemCard = ({ item, restrauntId, setCartReloading }) => {

  const {
    addItemToCart,
    removeItemToCart,
    dishToCart,
    addCustomisedItemToCartFromCart,
    removeCustomisedItemToCartFromCart,
  } = authContext();
  const [customisedItems, setCustomisedItems] = useState([]);

  const cutomizeRef = useRef();
  const addMoreCustomiseRef = useRef();
  const [showAlert, setshowAlert] = useState(false);
  const [iWillChoose, setIWillChoose] = useState(null);

  const addQty = async () => {
    try {
      const isAdded = await addItemToCart(item.item.id, restrauntId);
      if (isAdded) {
        setCartReloading(true);
      }
    } catch (err) {}
  };

  const removeQty = async () => {
    try {
      const isRemoved = await removeItemToCart(item.item.id, restrauntId);
      if (isRemoved) {
        setCartReloading(true);
      }
    } catch (err) {}
  };

  const openAddCustomisationOptionsBox = () => {
    setIWillChoose(true);
    if (addMoreCustomiseRef !== null) {
      addMoreCustomiseRef.current.open();
    }
  };

  const handleAddCustomisedDish = async () => {
    try {
      var isAdded = await addCustomisedItemToCartFromCart(
        item.id,
        item.item.id,
        restrauntId,
        customisedItems,
        false
      );
      setIWillChoose(false);
      if (isAdded) {
        setCartReloading(true);
        cutomizeRef.current.close();
      }
    } catch (err) {}
  };

  const removeCustomisedDishQty = async () => {
    try {
      const isRemoved = await removeCustomisedItemToCartFromCart(
        item.id,
        item.item.id,
        restrauntId
      );
      if (isRemoved) {
        setCartReloading(true);
      }
    } catch (err) {}
  };

  const repeatCustomisedOrder = async () => {
    try {
      addMoreCustomiseRef.current.close();
      var isAdded = await addCustomisedItemToCartFromCart(
        item.id,
        item.item.id,
        restrauntId,
        customisedItems,
        true
      );
      if (isAdded) {
        setCartReloading(true);
        cutomizeRef.current.close();
      }
    } catch (err) {}
  };

  const chooseAgainCustomisedOrder = () => {
    addMoreCustomiseRef.current.close();
    cutomizeRef.current.open();
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

  const getCustomisationOptionsForDish = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/restraunt/custom-dish-head/?menu_dish=${item.item.id}`
      );
      const data = res.data;
      setCustomisedItems(data);
    } catch (err) {}
  };

  useEffect(() => {
    if (item.item.is_customisable) {
      getCustomisationOptionsForDish();
    }
  }, [iWillChoose]);

  return (
    <View
      style={{
        marginVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start",justifyContent:"flex-start" }}>
          <VegNonVegSymbol is_veg={item.item.is_veg} />

          <View>
            <Text numberOfLines={1} style={styles.dishName}>
              {item.item.item_name}
            </Text>
            {item.item.is_customisable && (
              <Text style={{ fontSize: 12, color: "#cecece",marginLeft:5,marginTop:2 }}>
                {item.cart_item
                  .map((customised_item) => {
                    return customised_item.customisation_option.name;
                  })
                  .join(", ")}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View style={styles.addRemoveQtyContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={dishToCart.status}
            onPress={
              item.item.is_customisable ? removeCustomisedDishQty : removeQty
            }
            style={styles.addRemoveButton}
          >
            <Text style={{ color: "#FF6666", fontWeight: "700", fontSize: 20 }}>
              -
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              color: "#FF6666",
              fontWeight: "700",
              paddingHorizontal: 5,
              borderRadius: 5,
            }}
          >
            {dishToCart.status && dishToCart.itemId == item.item.id ? (
              <ActivityIndicator size={14} color="#FF6666" />
            ) : (
              item.qty
            )}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              item.item.is_customisable
                ? openAddCustomisationOptionsBox
                : addQty
            }
            disabled={dishToCart.status}
            style={styles.addRemoveButton}
          >
            <Text style={{ color: "#FF6666", fontWeight: "700", fontSize: 20 }}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontWeight: "700",
            color: "#2d2d2e",
            width: 45,
          }}
        >
          ₹{item.item_total}
        </Text>
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
              {item.item.item_name}
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
            {customisedItems.map((item_head, index) => {
              return (
                <View key={index} style={{ marginTop: index == 0 ? 0 : 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    {item_head.name} ({item_head.current_selected || 0} /{" "}
                    {item_head.max_selection})
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: 20,
                      padding: 10,
                      marginTop: 10,
                    }}
                  >
                    {item_head.custom_dish_head.map((add_item) => {
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
                            <VegNonVegSymbol is_veg={item.item.is_veg} />

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
                                item_head.current_selected ==
                                  item_head.max_selection && !add_item.select
                                  ? "#cecece"
                                  : "#FF6666"
                              }
                              unfillColor={
                                item_head.current_selected ==
                                  item_head.max_selection && !add_item.select
                                  ? "#cecece"
                                  : "#FFFFFF"
                              }
                              text={add_item.name}
                              iconStyle={{ borderColor: "red" }}
                              innerIconStyle={{ borderWidth: 2 }}
                              disableText={true}
                              disabled={
                                item_head.current_selected ==
                                  item_head.max_selection && !add_item.select
                              }
                              isChecked={add_item.select}
                              onPress={(isChecked) => {
                                updateCustomisedDishSelection(
                                  isChecked,
                                  item_head.id,
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
              {item.item.item_name}
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
    </View>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  dishName: {
    marginLeft: 5,

    fontSize: 13,
  },
  addRemoveQtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 1,
    borderColor: "#cecece",
  },
  addRemoveButton: {
    // backgroundColor: "#FF6666",
    paddingHorizontal: 8,
    borderRadius: 10,
    marginHorizontal: 3,
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
