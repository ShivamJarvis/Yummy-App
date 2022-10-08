import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FaIcon from 'react-native-vector-icons/FontAwesome'

const VegNonVegSymbol = (is_veg) => {
  return (
    <View style={{borderWidth:2,borderColor:is_veg ? "#059610" : "#a80d02", borderRadius:5, padding:4}}>
        <FaIcon name="circle" color={is_veg ? "#059610" : "#a80d02"} />
      
    </View>
  );
};

export default VegNonVegSymbol;

const styles = StyleSheet.create({});
