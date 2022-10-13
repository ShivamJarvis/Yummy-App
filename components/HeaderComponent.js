import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { authContext } from "../contexts/AuthContext";
import * as Location from "expo-location";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import SelectAddress from "./SelectAddress";

const HeaderComponent = () => {
  const { location, locationName, setLocationName, selectedAddress } =
    authContext();
  const newAddressSheetRef = useRef();
  useEffect(() => {
    const latLongLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    Location.reverseGeocodeAsync(latLongLocation)
      .then((result) => {
        setLocationName(
          `${result[0].name}, ${result[0].district}, ${result[0].subregion} - ${result[0].postalCode}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <View style={{ marginTop: 15, marginLeft: 10 }}>
      <View style={styles.leftHeaderContainer}>
        {!selectedAddress ? (
          <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
            <View style={{ flexDirection: "row", alignContent: "center" }}>
              <IonIcon name="location-sharp" size={20} color={"#f78783"} />

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => newAddressSheetRef.current.open()}
              >
                <Text style={styles.title}>Deliver Now</Text>
                <IonIcon
                  name="chevron-down-sharp"
                  size={20}
                  color={"#f78783"}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.subTitle}> {locationName}</Text>
          </View>
        ) : (
          <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
            <View style={{ flexDirection: "row", alignContent: "center" }}>
              {selectedAddress.address_type == "Home" && (
                <IonIcon name="home-sharp" color={"#f78783"} size={20} />
              )}
              {selectedAddress.address_type == "Work" && (
                <MCIcon
                  name="office-building-marker-outline"
                  color={"#f78783"}
                  size={20}
                />
              )}
              {selectedAddress.address_type == "Friends & Family" && (
                <FAIcon name="users" color={"#f78783"} size={20} />
              )}
              {selectedAddress.address_type == "Other" && (
                <FAIcon name="location-arrow" color={"#f78783"} size={20} />
              )}
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => newAddressSheetRef.current.open()}
              >
                <Text style={styles.title}>{selectedAddress.address_type}</Text>
                <IonIcon
                  name="chevron-down-sharp"
                  size={20}
                  color={"#f78783"}
                />
              </TouchableOpacity>
            </View>

            <Text numberOfLines={1} style={styles.subTitle}>
              {selectedAddress.address_line_1}, {selectedAddress.address_line_2}{" "}
              - {selectedAddress.zip_code}
            </Text>
          </View>
        )}
      </View>
      <SelectAddress newAddressSheetRef={newAddressSheetRef} />
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
    marginLeft: 5,
  },
  subTitle: {
    color: "#ababab",
  },
});
