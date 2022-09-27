import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { authContext } from "../contexts/AuthContext";
import * as Location from 'expo-location';

const HeaderComponent = () => {
  const { location,locationName, setLocationName } = authContext();
  useEffect(()=>{
   
    const latLongLocation = {
        'latitude':location.coords.latitude,
        'longitude':location.coords.longitude
    }
    Location.reverseGeocodeAsync(latLongLocation).then((result)=>{
        // console.log(result[0])
        setLocationName(`${result[0].district}, ${result[0].subregion} - ${result[0].postalCode}`)
    }).catch((err)=>{
        console.log(err)
    })
  },[])
  return (
    <View>
      <View style={styles.leftHeaderContainer}>
        <Image
          source={require("./../assets/images/header-icon.png")}
          style={styles.imageStyle}
        />
        <View style={{justifyContent:"center",alignItems:"flex-start"}}>
          <Text style={styles.subTitle}>Deliver Now</Text>
          <Text style={styles.title}> {locationName}</Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  leftHeaderContainer: {
    flexDirection: "row",
  },

  imageStyle: {
    width: 48,
    height: 48,
    transform: [{ rotateY: "180deg" }],
    marginRight: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
    flexWrap:"wrap",
    width:Dimensions.get('screen').width - 10,
  },
  subTitle: {
    color: "#ababab",
  },
});
