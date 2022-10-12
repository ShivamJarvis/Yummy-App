import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { authContext } from "../contexts/AuthContext";
import Toast from "react-native-simple-toast";

const RadioButton = ({ data,addressSavedFor,setAddressSavedFor }) => {
  const { userAddresses } = authContext();
  const handleSaveForSelection = (name) => {

    const res = userAddresses.filter(item=>item.address_type == name)
    if(res.length > 0){
      Toast.show(`${name} already saved!`,Toast.LONG)
      return 
    }
    setAddressSavedFor(name)
  }
  return (
    <View style={{flexDirection:"row",flexWrap:"wrap"}}>
      {data.map((item) => {
        return (
          <View key={item.label} style={{marginRight:20,marginVertical:10,borderWidth:1,paddingHorizontal:10,paddingVertical:5,borderRadius:15,backgroundColor: addressSavedFor == item.label ? "#FF6666" : "#ffffff",borderColor:"#FF6666"}} >

          <Pressable style={{flexDirection:"row"}}  onPress={()=>handleSaveForSelection(item.label)} >
            {item.icon}
            <Text style={{color: addressSavedFor == item.label ? "#ffffff" : "#000000"}}> {item.label}</Text>
          </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({});
