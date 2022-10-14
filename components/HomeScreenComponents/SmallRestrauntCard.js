import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const SmallRestrauntCard = ({ navigation, item }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("RestrauntDetailsScreen", { id: item?.id });
      }}
    >
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: item?.card_image }}
          style={{ width: "100%", height: 100, borderRadius: 10 }}

        />

        <Text numberOfLines={1} style={styles.title}>
          {item?.name}
        </Text>
        
      </View>
    </TouchableOpacity>
  );
};

export default SmallRestrauntCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 100,
    minHeight: 100,
    marginHorizontal: 5,

    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },
  subTitle: {
    fontSize: 12,
    color: "#707070",
    marginTop: 5,
  },
});
