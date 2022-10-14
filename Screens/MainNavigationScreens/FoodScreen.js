import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,

} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL } from "@env";
import { getDistance } from "geolib";
import DetailedRestrauntCard from "../../components/HomeScreenComponents/DetailedRestrauntCard";
import { authContext } from "../../contexts/AuthContext";
import LoadingComponent from "./../../components/LoadingComponent";
import HeaderComponent from "../../components/HeaderComponent";
import CartFloatComponent from "../../components/CartFloatComponent";
import SearchBarComponent from "../../components/SearchBarComponent";

const CuisineBasedRestraunts = ({ navigation }) => {
  const [restraunts, setRestraunts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { globalCoordinates } = authContext();
  const getRestraunts = async () => {
    try {
      setIsLoading(true);

      const customerLocation = {
        latitude: globalCoordinates.latitude,
        longitude: globalCoordinates.longitude,
      };

      const res = await axios.get(
        `${API_URL}/restraunt/`
      );

      var filteredRestraunts = res.data.filter(
        (restraunt) => {
          var restrauntLocation = {
            latitude: restraunt.latitude,
            longitude: restraunt.longitude,
          };

          var distance = getDistance(customerLocation, restrauntLocation);

          if (distance / 1000 <= restraunt.maximum_delivery_radius) {
            restraunt.distance = distance / 1000;
            return restraunt;
          }
        }
      );

      setRestraunts(filteredRestraunts);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getRestraunts();
  }, [globalCoordinates]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <HeaderComponent />
      <SearchBarComponent />
      {restraunts.length > 0 ? (
        <FlatList
          data={restraunts}
          renderItem={({ item, index }) => (
            <DetailedRestrauntCard key={index} restraunt={item} />
          )}
        />
      ) : (
        <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
          <Image
            source={require("./../../assets/images/not-found.gif")}
            style={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <Text style={{textAlign:"center",fontSize:24}}>No Nearby Restraunts Found</Text>
        </View>
      )}
        <CartFloatComponent />
    </SafeAreaView>
  );
};

export default CuisineBasedRestraunts;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
});
