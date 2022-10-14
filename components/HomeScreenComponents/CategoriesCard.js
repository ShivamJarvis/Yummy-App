import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";


const CategoriesCard = ({ id, imageUrl, title }) => {
  const navigation = useNavigation()
  
  

  return (
    <TouchableOpacity onPress={()=>navigation.navigate("CuisineBasedRestraunts",{
      "id":id,
      "name":title
    })}>
      <View style={styles.cardContainer}>
        <Image source={{uri:imageUrl}} style={{width:"100%",height:"100%",borderRadius:10}} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoriesCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 100,
    height: 100,
    
    marginHorizontal: 5,
    position: "relative",
    borderRadius:10
  },
  title:{
    color: "#ffffff",
    position: "absolute",
    fontWeight:"700",
    bottom: 0,
    marginBottom:10,
    marginLeft:10
  },
});
