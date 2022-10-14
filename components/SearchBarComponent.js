import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const SearchBarComponent = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.containerStyle} activeOpacity={0.7}>
      <Text style={{ color: "#6e6e6e" }}>
        Search for restraunt, item and more
      </Text>
      <FeatherIcon name="search" size={18} color="#6e6e6e" />
    </TouchableOpacity>
  );
};

export default SearchBarComponent;

const styles = StyleSheet.create({
  containerStyle: {
    width: Dimensions.get("window").width - 20,
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: "#ededed",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
