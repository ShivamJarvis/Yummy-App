import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'
import {API_URL} from "@env"
import { authContext } from "../../contexts/AuthContext";

const SearchedRestrauntCard = ({ item }) => {
    const {accessToken} = authContext()
    const navigation = useNavigation()
    const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
    const handleSearchedRestraunt = () => {
        axios.post(`${API_URL}/restraunt/customer-search/`,{restraunt_id:item.id},config).then(res=>{
        }).catch(err=>{
            
        })
        navigation.navigate("RestrauntDetailsScreen", { id: item.id });
    }
  return (
    <TouchableOpacity style={{marginVertical:15}} activeOpacity={0.7} onPress={handleSearchedRestraunt}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: item.card_image }}
          style={{ width: 70, height: 70, borderRadius: 50 }}
        />
        <View style={{marginLeft:20}}>
          <Text style={{fontSize:16,fontWeight:"700"}} numberOfLines={1}>{item.name}</Text>
          <Text style={{fontSize:13,color:"#cecece"}}>Restraunt</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchedRestrauntCard;

const styles = StyleSheet.create({});
