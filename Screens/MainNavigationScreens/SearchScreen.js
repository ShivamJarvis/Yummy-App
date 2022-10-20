import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Searchbar, Chip } from "react-native-paper";
import { authContext } from "../../contexts/AuthContext";
import CategoriesCard from "../../components/HomeScreenComponents/CategoriesCard";
import axios from "axios";
import { API_URL } from "@env";
import SearchedRestrauntCard from "./../../components/SearchScreenComponents/SearchedRestrauntCard";
import { getDistance } from "geolib";
import SmallRestrauntCard from "../../components/HomeScreenComponents/SmallRestrauntCard";

const SearchScreen = ({ navigation }) => {
  const { cuisineData, accessToken, globalCoordinates } = authContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [favouriteRestraunts, setFavouriteRestraunts] = useState([]);
  const handleSearchText = (query) => {
    setSearchQuery(query);
    setSearchResults([]);
    var customerLocation = {
      latitude: globalCoordinates.latitude,
      longitude: globalCoordinates.longitude,
    };
    if (query.length > 3) {
      axios
        .get(`${API_URL}/restraunt/restraunt-search/?search=${query}`)
        .then((res) => {
          const validRestraunts = res.data.filter((item) => {
            var restrauntLocation = {
              latitude: item.latitude,
              longitude: item.longitude,
            };
            var distance = getDistance(customerLocation, restrauntLocation);

            if (distance / 1000 <= item.maximum_delivery_radius) {
              return item;
            }
          });
          setSearchResults(validRestraunts);
        })
        .catch((err) => {
          
        });
    }
  };

  const getRecentSearches = () => {
    const customerLocation = {
      latitude: globalCoordinates.latitude,
      longitude: globalCoordinates.longitude,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .get(`${API_URL}/restraunt/recent-search/`, config)
      .then((res) => {
        setRecentSearches(res.data);
      })
      .catch((err) => {});

    axios
      .get(`${API_URL}/restraunt/favourite-restraunts/`, config)
      .then((res) => {
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
        setFavouriteRestraunts(filteredRestraunts);

      })
      .catch((err) => {});
  };

  useEffect(() => {
    getRecentSearches();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 10 }}
    >
      <View style={styles.headingContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <FeatherIcon
            name="chevron-left"
            size={32}
            style={{ color: "#ff6666" }}
          />
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Back</Text>
        </TouchableOpacity>
      </View>
      <Searchbar
        placeholder="Search for restraunt, item and more"
        onChangeText={handleSearchText}
        value={searchQuery}
        style={{ borderWidth: 1, borderRadius: 10, borderColor: "#cecece" }}
        placeholderTextColor="#cecece"
        cursorColor={"#ff6666"}
        elevation={0}
        inputStyle={{ fontSize: 16 }}
        numberOfLines={1}
        multiline={false}
      />
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item, index }) => {
            return <SearchedRestrauntCard item={item} />;
          }}
        />
      ) : (
        <ScrollView>
          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <Text style={{ fontWeight: "700", fontSize: 17 }}>
                Recent Searches
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {recentSearches.map((item) => {
                  return (
                    <Chip
                      key={item.id}
                      icon={() => (
                        <MaterialIcons
                          color={"#cecece"}
                          name="history-toggle-off"
                          size={20}
                        />
                      )}
                      onPress={() =>
                        navigation.navigate("RestrauntDetailsScreen", {
                          id: item.restraunt.id,
                        })
                      }
                      style={styles.historyChip}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ color: "#6e6e6e", fontSize: 12 }}
                      >
                        {item.restraunt.name}
                      </Text>
                    </Chip>
                  );
                })}
              </View>
            </View>
          )}
          {favouriteRestraunts.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <Text
                style={{ fontWeight: "700", fontSize: 17, marginBottom: 10 }}
              >
                Order from your favourites
              </Text>
              <FlatList
                style={{ marginTop: 20 }}
                data={favouriteRestraunts}
                renderItem={({ item, index }) => (
                  <SmallRestrauntCard
                    item={item.restraunt}
                    key={item.id}
                    navigation={navigation}
                  />
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          

          <View style={styles.recentSearchesContainer}>
            <Text style={{ fontWeight: "700", fontSize: 17, marginBottom: 10 }}>
              Popular Cuisines
            </Text>
            <FlatList
              data={cuisineData}
              renderItem={({ item, index }) => (
                <CategoriesCard
                  id={item.id}
                  title={item.name}
                  imageUrl={item.image}
                />
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  headingContainer: {
    paddingVertical: 5,
    marginVertical: 10,
  },
  recentSearchesContainer: {
    marginVertical: 15,
  },
  historyChip: {
    marginRight: 12,
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#cecece",
  },
});
