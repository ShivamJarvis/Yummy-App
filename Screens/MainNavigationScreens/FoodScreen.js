import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
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
import FilterSheet from "../../components/FoodScreenComponents/FilterSheet";

const CuisineBasedRestraunts = ({ navigation }) => {
  const [restraunts, setRestraunts] = useState([]);
  const [filteredRestraunts, setFilteredRestraunts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestrauntFilter, setRestrauntFilter] = useState(false);
  const { globalCoordinates, filters, setFilters } = authContext();
  const foodSheetRef = useRef(null);
  const getRestraunts = async () => {
    try {
      setIsLoading(true);

      const customerLocation = {
        latitude: globalCoordinates.latitude,
        longitude: globalCoordinates.longitude,
      };

      const res = await axios.get(`${API_URL}/restraunt/`);

      var nearByRestraunts = res.data.filter((restraunt) => {
        var restrauntLocation = {
          latitude: restraunt.latitude,
          longitude: restraunt.longitude,
        };

        var distance = getDistance(customerLocation, restrauntLocation);

        if (distance / 1000 <= restraunt.maximum_delivery_radius) {
          restraunt.distance = distance / 1000;
          return restraunt;
        }
      });

      setRestraunts(nearByRestraunts);
      setFilteredRestraunts(nearByRestraunts);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const sortRestraunts = (currentRestraunts) => {
    var currentFilter = filters;

    currentFilter = currentFilter.filter((item) => item.heading == "Sort");
    currentFilter = currentFilter[0];
    currentFilter.options.map((item) => {
      if (currentFilter.selectedOption == item.name) {
        if (item.name == "Rating") {
          currentRestraunts = currentRestraunts.sort(
            (a, b) => a.rating - b.rating
          );
          currentRestraunts = currentRestraunts.reverse();
        }
        if (item.name == "Cost: Low To High") {
          currentRestraunts = currentRestraunts.sort(
            (a, b) => a.cost_of_two - b.cost_of_two
          );
        }
        if (item.name == "Cost: High To Low") {
          currentRestraunts = currentRestraunts.sort(
            (a, b) => a.cost_of_two - b.cost_of_two
          );
          currentRestraunts = currentRestraunts.reverse();
        }
      }
    });

    return currentRestraunts;
  };

  const exploreRestraunts = (currentRestraunts) => {
    var currentFilter = filters;

    currentFilter = currentFilter.filter((item) => item.heading == "Explore");
    currentFilter = currentFilter[0];
    var exploredRestraunts = [];
    var checkAnyChangeInFilter = false;
    currentFilter.options.map((item) => {
      if (item.is_selected == true && checkAnyChangeInFilter == false) {
        checkAnyChangeInFilter = true;
      }
    });

    if (checkAnyChangeInFilter == true) {
      currentFilter.options.map((item) => {

        

        if (item.is_selected == true && item.name == "New on Yummy") {
          currentRestraunts.map((restraunt) => {
            if (restraunt.is_new && !exploredRestraunts.includes(restraunt)) {
              exploredRestraunts.push(restraunt);
            }
          });
        }
        if (item.is_selected == true && item.name == "Yummy Exclusive") {
          currentRestraunts.map((restraunt) => {
            if (restraunt.is_exclusive && !exploredRestraunts.includes(restraunt)) {
              exploredRestraunts.push(restraunt);
            }
          });
        }
      });
      return exploredRestraunts;
    }
    return currentRestraunts;
  };

  const cuisineFilterRestraunts = (currentRestraunts) => {
    var currentFilter = filters;

    var cuisineRestraunts = [];
    currentFilter = currentFilter.filter((item) => item.heading == "Cuisines");
    currentFilter = currentFilter[0];
    var checkAnyChangeInFilter = false;
    currentFilter.options.map((item) => {
      if (item.is_selected == true && checkAnyChangeInFilter == false) {
        checkAnyChangeInFilter = true;
      }
    });

    if (checkAnyChangeInFilter) {
      currentFilter.options.map((item) => {
        if (item.is_selected == true) {
          currentRestraunts.map((restraunt) => {
            if (restraunt.cuisine.includes(item.id) && !cuisineRestraunts.includes(restraunt)) {
              cuisineRestraunts.push(restraunt);
            }
          });
        }
      });
      return cuisineRestraunts;
    }
    return currentRestraunts;
  };

  const ratingFilterRestraunts = (currentRestraunts) => {
    var currentFilter = filters;
    var ratingRestraunts = [];
    currentFilter = currentFilter.filter((item) => item.heading == "Ratings");
    currentFilter = currentFilter[0];
    var checkAnyChangeInFilter = false;
    currentFilter.options.map((item) => {
      if (item.is_selected == true && checkAnyChangeInFilter == false) {
        checkAnyChangeInFilter = true;
      }
    });
    if (checkAnyChangeInFilter) {
      currentFilter.options.map((item) => {
        if (item.is_selected == true && item.name == "Rating 4.5+") {
          currentRestraunts.map((restraunt) => {
            if (
              restraunt.rating >= 4.5 &&
              !ratingRestraunts.includes(restraunt)
            ) {
              ratingRestraunts.push(restraunt);
            }
          });
        }
        if (item.is_selected == true && item.name == "Rating 4.0+") {
          currentRestraunts.map((restraunt) => {
            if (
              restraunt.rating >= 4.0 &&
              !ratingRestraunts.includes(restraunt)
            ) {
              ratingRestraunts.push(restraunt);
            }
          });
        }
        if (item.is_selected == true && item.name == "Rating 3.5+") {
          currentRestraunts.map((restraunt) => {
            if (
              restraunt.rating >= 3.5 &&
              !ratingRestraunts.includes(restraunt)
            ) {
              ratingRestraunts.push(restraunt);
            }
          });
        }
      });
      return ratingRestraunts;
    }
    return currentRestraunts;
  };

  const vegOrNonVegorBothRestraunts = (currentRestraunts) => {
    var currentFilter = filters;

    currentFilter = currentFilter.filter(
      (item) => item.heading == "Veg/Non-Veg"
    );
    currentFilter = currentFilter[0];
    var checkAnyChangeInFilter = false;
    currentFilter.options.map((item) => {
      if (item.is_selected == true && checkAnyChangeInFilter == false) {
        checkAnyChangeInFilter = true;
      }
    });

    if (checkAnyChangeInFilter) {
      currentFilter.options.map((item) => {
        if (currentFilter.selectedOption == item.name) {
          if (item.name == "Pure Veg") {
            currentRestraunts = currentRestraunts.filter(
              (restraunt) => restraunt.food_type == "Veg"
            );
          }
          if (item.name == "Non Veg") {
            currentRestraunts = currentRestraunts.filter(
              (restraunt) => restraunt.food_type == "Non-Veg"
            );
          }
          if (item.name == "Both") {
            currentRestraunts = currentRestraunts.filter(
              (restraunt) =>
                restraunt.food_type == "Both" ||
                restraunt.food_type == "Veg" ||
                restraunt.food_type == "Non-Veg"
            );
          }
        }
      });
      return currentRestraunts;
    }
    return currentRestraunts;
  };

  const costBasedFilterRestraunts = (currentRestraunts) => {
    var currentFilter = filters;

    var costBasedRestraunts = [];
    currentFilter = currentFilter.filter(
      (item) => item.heading == "Cost for two"
    );
    currentFilter = currentFilter[0];

    var checkAnyChangeInFilter = false;
    currentFilter.options.map((item) => {
      if (item.is_selected == true && checkAnyChangeInFilter == false) {
        checkAnyChangeInFilter = true;
      }
    });

    if (checkAnyChangeInFilter) {
      currentFilter.options.map((item) => {
        if (item.is_selected == true && item.name == "Rs. 200-Rs. 500") {
          currentRestraunts.map((restraunt) => {
            if (
              restraunt.cost_of_two >= 200 &&
              restraunt.cost_of_two <= 500 &&
              !costBasedRestraunts.includes(restraunt)
            ) {
              costBasedRestraunts.push(restraunt);
            }
          });
        }
        if (item.is_selected == true && item.name == "Greater than Rs. 500") {
          currentRestraunts.map((restraunt) => {
            if (
              restraunt.cost_of_two >= 500 &&
              !costBasedRestraunts.includes(restraunt)
            ) {
              costBasedRestraunts.push(restraunt);
            }
          });
        }
        if (item.is_selected == true && item.name == "Less than Rs. 200") {
          currentRestraunts.map((restraunt) => {
            if (
              restraunt.cost_of_two <= 200 &&
              !costBasedRestraunts.includes(restraunt)
            ) {
              costBasedRestraunts.push(restraunt);
            }
          });
        }
      });
      return costBasedRestraunts;
    }
    return currentRestraunts;
  };

  const filterRestraunts = () => {
    var filterAppliedRestraunts = restraunts;
    filterAppliedRestraunts = sortRestraunts(filterAppliedRestraunts);
    filterAppliedRestraunts = exploreRestraunts(filterAppliedRestraunts);
    filterAppliedRestraunts = cuisineFilterRestraunts(filterAppliedRestraunts);
    filterAppliedRestraunts = ratingFilterRestraunts(filterAppliedRestraunts);
    filterAppliedRestraunts = vegOrNonVegorBothRestraunts(filterAppliedRestraunts);
    filterAppliedRestraunts = costBasedFilterRestraunts(filterAppliedRestraunts);
    setFilteredRestraunts(filterAppliedRestraunts);

    setRestrauntFilter(false);
  };

  useEffect(() => {
    getRestraunts();
  }, [globalCoordinates]);

  useEffect(() => {
    filterRestraunts();
  }, [isRestrauntFilter]);

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
      <TouchableOpacity
        onPress={() => {
          foodSheetRef.current.open();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ff6666",
          borderRadius: 10,
          padding: 10,
          width: 100,
          margin: 10,
          justifyContent: "space-evenly",
        }}
      >
        <FeatherIcon color={"#ffffff"} name="filter" size={20} />
        <Text style={{ color: "#ffffff", fontWeight: "700" }}>Filters</Text>
      </TouchableOpacity>
      {filteredRestraunts.length > 0 ? (
        <FlatList
          data={filteredRestraunts}
          renderItem={({ item, index }) => (
            <DetailedRestrauntCard key={index} restraunt={item} />
          )}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Image
            source={require("./../../assets/images/not-found.gif")}
            style={{ width: 200, height: 200, alignSelf: "center" }}
          />
          <Text style={{ textAlign: "center", fontSize: 24 }}>
            No Nearby Restraunts Found
          </Text>
        </View>
      )}
      <CartFloatComponent />
      <FilterSheet
        filterSheetRef={foodSheetRef}
        restraunts={restraunts}
        setRestraunts={setRestraunts}
        setRestrauntFilter={setRestrauntFilter}
      />
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
