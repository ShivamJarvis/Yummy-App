import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { API_URL } from "@env";
import { getDistance } from "geolib";
import DetailedRestrauntCard from "../../components/HomeScreenComponents/DetailedRestrauntCard";
import { authContext } from "../../contexts/AuthContext";
import LoadingComponent from "./../../components/LoadingComponent";
import CartFloatComponent from "../../components/CartFloatComponent";


const MyFavouritesRestrauntScreen = ({navigation}) => {
 
  const [restraunts, setRestraunts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { globalCoordinates,accessToken } = authContext();
  const getRestraunts = async () => {
    try {
      setIsLoading(true);
      const customerLocation = {
        latitude: globalCoordinates.latitude,
        longitude: globalCoordinates.longitude,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await axios.get(`${API_URL}/restraunt/favourite-restraunts/`, config)
     

      var filteredRestraunts = res.data.filter((item) => {
          var restrauntLocation = {
            latitude: item.restraunt.latitude,
            longitude: item.restraunt.longitude,
          };

          var distance = getDistance(customerLocation, restrauntLocation);

          if (distance / 1000 <= item.restraunt.maximum_delivery_radius) {
            item.restraunt.distance = distance / 1000;
            return item.restraunt;
          }
        }
      );
        
      setRestraunts(filteredRestraunts);

      setIsLoading(false);
    } catch (err) {
      
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getRestraunts();
  }, []);

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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={35} style={{ color: "#f78783" }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favourites</Text>
      </View>

      {restraunts.length > 0 ? (
        <FlatList
          data={restraunts}
          renderItem={({ item, index }) => (
            <DetailedRestrauntCard key={index} restraunt={item.restraunt} />
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
}

export default MyFavouritesRestrauntScreen

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
