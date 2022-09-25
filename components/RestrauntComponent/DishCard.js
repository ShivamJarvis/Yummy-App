import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import MciIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Rating, AirbnbRating } from "react-native-ratings";

const DishCard = ({ dish }) => {
  let today = new Date();
  let currentTime = today.toLocaleTimeString("en-SE");

  return (
    <TouchableOpacity
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
                  style={{ fontSize: 10, fontWeight: "700", color: "#FF6666" }}
                >
                  Bestseller
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            {dish.item_name}
          </Text>
          <Text style={{ fontSize: 16, marginTop: 2 }}>₹{dish.item_price}</Text>

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

        {(currentTime > dish.open_time && currentTime < dish.close_time) && (
          <View style={{ position: "absolute", bottom: -16, right: 6 }}>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
              <Text style={{ color: "#ffffff", fontSize: 16 }}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
