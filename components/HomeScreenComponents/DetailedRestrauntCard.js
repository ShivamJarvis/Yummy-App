import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const DetailedRestrauntCard = ({ restraunt }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("RestrauntDetailsScreen", { id: restraunt?.id })
      }
    >
      <View style={styles.cardContainer}>
        <View style={{ flexDirection: "row" }}>
          <View>
            <Image
              source={{ uri: restraunt.card_image }}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={{ fontSize: 16, color: "#292929", fontWeight: "700" }}>
              {restraunt.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IonIcon name="star" size={16} color={"#287d3d"} />
              <Text
                style={{
                  fontSize: 14,
                  marginLeft: 5,
                  color: "#292929",
                  fontWeight: "700",
                }}
              >
                {restraunt.rating}
              </Text>
            </View>
            <Text style={styles.subDescription} numberOfLines={1}>
              {restraunt.cuisine_description}
            </Text>
            <Text style={styles.subDescription}>
              {restraunt.location} {Math.round(restraunt.distance * 10) / 10} Km
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DetailedRestrauntCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,

    width: Dimensions.get("window").width - 20,
    alignSelf: "center",
    marginVertical: 15,
  },
  imageStyle: {
    height: 120,
    width: 120,
    borderRadius: 10,
  },
  descriptionContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  subDescription: {
    fontSize: 12,
    color: "#595959",
    fontWeight: "700",
    marginTop:5
  },
});
