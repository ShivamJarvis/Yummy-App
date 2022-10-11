import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { authContext } from "../../contexts/AuthContext";
import IonIcon from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";

import LoadingComponent from "../../components/LoadingComponent";
import RBSheet from "react-native-raw-bottom-sheet";
import RadioButton from "../../components/RadioBUtton";


const AddAddressScreen = () => {
  const { location } = authContext();

  const addAddressSheetRef = useRef();

  const [isLoading, setisLoading] = useState(false);
  const [locationDescription, setLocationDescription] = useState("");
  const [locationName, setLocationName] = useState("");

  const data = [
    {
      label: "Home",
    },
    {
      label: "Work",
    },
    {
      label: "Friends & Family",
    },
    {
      label: "Other",
    },
  ]

  const handleDragEnd = async (e) => {
    try {
      setisLoading(true);
      const coordinates = e.nativeEvent.coordinate;

      const result = await Location.reverseGeocodeAsync(coordinates);
      console.log(result);
      setLocationDescription(
        `${result[0].name}, ${result[0].district}, ${result[0].subregion} - ${result[0].postalCode}`
      );
      setLocationName(result[0].name);

      setisLoading(false);
    } catch (err) {}
  };
  const handleMapReady = async (e) => {
    try {
      setisLoading(true);
      const coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const result = await Location.reverseGeocodeAsync(coordinates);
      console.log(result);
      setLocationDescription(
        `${result[0].name}, ${result[0].district}, ${result[0].subregion} - ${result[0].postalCode}`
      );
      setLocationName(result[0].name);

      setisLoading(false);
    } catch (err) {}
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{
          flex: 3,
          width: "100%",
        }}
        onMapReady={handleMapReady}
        minZoomLevel={19}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        followsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          draggable={true}
          onDragEnd={handleDragEnd}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#000000",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 10,

                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                Order will be delivered here
              </Text>
              <Text
                style={{
                  color: "#cecece",
                  fontSize: 10,
                }}
              >
                Place the pin accurately
              </Text>
            </View>
            <IonIcon name="pin" style={{}} size={45} color={"#000000"} />
          </View>
        </Marker>
      </MapView>

      {isLoading ? (
        <LoadingComponent />
      ) : (
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            backgroundColor: "#ffffff",
            flex: 1,
          }}
        >
          <View style={{ flex: 2 }}>
            <Text style={{ color: "#2b2b2b", fontWeight: "700", fontSize: 12 }}>
              SELECT DELIVERY LOCATION
            </Text>

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IonIcon name="location" size={22} color={"#f78783"} />
                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: "700" }}>
                  {locationName}
                </Text>
              </View>
              <Text style={{ color: "#474747" }}>{locationDescription}</Text>
            </View>
          </View>
          <View >
            <TouchableOpacity
              style={{
                backgroundColor: "#f78783",
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                addAddressSheetRef.current.open();
              }}
            >
              <Text
                style={{ color: "#ffffff", fontWeight: "700", fontSize: 16 }}
              >
                CONFIRM LOCATION
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <RBSheet
        ref={addAddressSheetRef}
        height={Dimensions.get("window").height - 50}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            flex: 1,
            width: "100%",
            marginBottom: 10,
          }}
        >
          <View style={{ marginHorizontal: 10, flex: 1, marginTop: 10 }}>
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IonIcon name="location" size={22} color={"#f78783"} />
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  {locationName}
                </Text>
              </View>
              <Text style={{ color: "#474747" }}>{locationDescription}</Text>
            </View>

            <ScrollView style={{paddingTop:10,paddingBottom:100}} showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingVertical: 5,

                paddingHorizontal: 15,
                borderWidth: 1,
                borderColor: "#ffeeba",
                borderRadius: 10,
                backgroundColor: "#fff3cd",
                marginVertical: 25,
              }}
            >

              <Text style={{ color: "#856404", fontSize: 11 }}>
                A detailed address will help our Delivery Partner reach your
                doorstep easily.
              </Text>
            </View>

            <TextInput
              placeholder="HOUSE / FLAT / BLOCK NO."
              style={{
                height: 40,
                borderBottomColor: "#f78783",
                borderBottomWidth: 2,
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 30,
              }}
              cursorColor={"#f78783"}
              placeholderTextColor="#cecece"
            />

            <TextInput
              placeholder="APARTMENT / ROAD / AREA"
              style={{
                height: 40,
                borderBottomColor: "#f78783",
                borderBottomWidth: 2,
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 30,
              }}
              cursorColor={"#f78783"}
              placeholderTextColor="#cecece"
            />

            <TextInput
              placeholder="OTHER INSTRUCTION e.g. Call after reaching destination."
              style={{
                height: 40,
                borderBottomColor: "#f78783",
                borderBottomWidth: 2,
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 30,
              }}
              cursorColor={"#f78783"}
              placeholderTextColor="#cecece"
            />

            <View style={{paddingBottom:20}}>
              <Text>Save as</Text>

             <RadioButton data={data} />
            </View>

            </ScrollView>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#FF6666",
              borderWidth: 1,
              paddingVertical: 10,
              marginHorizontal: 10,
              marginBottom: 10,
              borderRadius: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#FF6666",
                textAlign: "center",
              }}
            >
              Add New Address
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
    radioButtonStyle:{
        
        
    }
});
