import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { authContext } from "../contexts/AuthContext";
import * as Location from 'expo-location';
import IonIcon from 'react-native-vector-icons/Ionicons'


const HeaderComponent = () => {
  const { location,locationName, setLocationName,selectedAddress } = authContext();
  useEffect(()=>{
   
    const latLongLocation = {
        'latitude':location.coords.latitude,
        'longitude':location.coords.longitude
    }
    Location.reverseGeocodeAsync(latLongLocation).then((result)=>{
        // console.log(result)
        setLocationName(`${result[0].name}, ${result[0].district}, ${result[0].subregion} - ${result[0].postalCode}`)
    }).catch((err)=>{
        console.log(err)
    })
  },[])
  console.log(selectedAddress)
  return (
    <View style={{marginTop:15}}>
      <View style={styles.leftHeaderContainer}>
    
        {
          !selectedAddress ? (<View style={{justifyContent:"center",alignItems:"flex-start"}}>
            <View style={{flexDirection:"row",alignContent:"center"}}>
            <IonIcon name="location-sharp" size={20} color={"#f78783"} />
            <Text style={styles.title}>Deliver Now</Text>
            </View>
          <Text style={styles.subTitle}> {locationName}</Text>
          </View>
          ):(<View style={{justifyContent:"center",alignItems:"flex-start"}}>
            <View style={{flexDirection:"row",alignContent:"center"}}>
            <IonIcon name="home-sharp" size={20} color={"#f78783"} />
            <Text style={styles.title}>{selectedAddress.address_type}</Text>
            </View>
          
          <Text style={styles.subTitle}> {locationName}</Text>
          </View>
          )
        }
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
    marginLeft:5
  },
  subTitle: {
    color: "#ababab",
  },
});
