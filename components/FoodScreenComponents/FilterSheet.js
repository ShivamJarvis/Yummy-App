import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { authContext } from "../../contexts/AuthContext";

import { RadioButton, Checkbox } from "react-native-paper";
import * as Progress from "react-native-progress";

const FilterSheet = ({
  filterSheetRef,
  restraunts,
  setRestraunts,
  setRestrauntFilter,
}) => {
  const { filters, setFilters } = authContext();
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const [isLoading, setIsLoading] = useState(false);

  const handleFilter = (isChecked, itemName) => {
    var currentSelectedFilter = selectedFilter;
    currentSelectedFilter.isChanged = true;

    currentSelectedFilter.options = currentSelectedFilter.options.map(
      (item) => {
        if (item.name === itemName) {
          if (isChecked) {
            item.is_selected = true;
          } else {
            item.is_selected = false;
          }
        }
        return item;
      }
    );

    setSelectedFilter(currentSelectedFilter);
    var currentFilters = filters;
    currentFilters = currentFilters.map((item) => {
      if (item.heading == currentSelectedFilter.heading) {
        item = currentSelectedFilter;
      }
      return item;
    });

    setFilters(currentFilters);
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const filterRestraunts = () => {
    try {
      setIsLoading(true);
      setRestrauntFilter(true);

      wait(2000).then(() => {
        setIsLoading(false);
        filterSheetRef.current.close();
      });
    } catch (err) {}
  };

  const handleClearFilters = () => {
    try {
      setIsLoading(true);
      var currentSelectedFilter = selectedFilter;
      currentSelectedFilter.options = currentSelectedFilter.options.map(
        (item) => {
          item.is_selected = false;
          return item;
        }
      );

      setSelectedFilter(currentSelectedFilter);
      var currentFilters = filters;
      currentFilters.map((head) => {
        head.options.map((item) => {
          item.is_selected = false;
          return item;
        });
        return head;
      });
      setRestrauntFilter(true);
      wait(2000).then(() => {
        setFilters(currentFilters);
        setIsLoading(false)
        filterSheetRef.current.close();
      });
    } catch (err) {}
  };

  return (
    <RBSheet
      ref={filterSheetRef}
      openDuration={250}
      height={Dimensions.get("window").height - 50}
      customStyles={{
        container: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
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
        <View style={{ borderBottomWidth: 1, borderBottomColor: "#cecece" }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "700" }}>Filter</Text>
            <TouchableOpacity
              onPress={() => {
                filterSheetRef.current.close();
              }}
            >
              <EntypoIcon name="cross" size={25} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              flex: 1,
              borderRightWidth: 1,
              borderRightColor: "#cecece",
            }}
          >
            {filters.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFilter(item);
                  }}
                  key={index}
                  style={{
                    ...styles.leftSideContainers,
                    borderLeftWidth:
                      selectedFilter.heading == item.heading ? 8 : 0,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>
                      {item.heading}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ flex: 2 }}>
            {isLoading && (
              <Progress.Bar
                progress={0.3}
                indeterminate={true}
                style={{ alignSelf: "center", width: "100%" }}
                color="#ff6666"
                borderWidth={0}
                height={2}
                
              />
            )}
            <ScrollView>
              <View>
                <Text style={styles.subHeadingStyle}>
                  {selectedFilter.subHeading}
                </Text>
              </View>
              {selectedFilter.multiSelect &&
                selectedFilter.options.map((item, index) => {
                  return (
                    <View
                      key={index + item.name}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}
                    >
                      <Checkbox
                        value={item.name}
                        status={item.is_selected ? "checked" : "unchecked"}
                        onPress={() =>
                          handleFilter(!item.is_selected, item.name)
                        }
                        color="#ff6666"
                      />
                      <Text>{item.name}</Text>
                    </View>
                  );
                })}

              {selectedFilter.multiSelect == false && (
                <RadioButton.Group
                  key={selectedFilter.heading}
                  onValueChange={(newValue) => {
                    const currentSelectedFilter = selectedFilter;
                    currentSelectedFilter.isChanged = true;
                    currentSelectedFilter.selectedOption = newValue;
                    setSelectedFilter(currentSelectedFilter);

                    var currentFilters = filters;
                    currentFilters = currentFilters.map((item) => {
                      if (item.heading == currentSelectedFilter.heading) {
                        item = currentSelectedFilter;
                      }
                      return item;
                    });

                    setFilters(currentFilters);
                  }}
                  value={selectedFilter.selectedOption}
                >
                  {selectedFilter.options.map((item) => {
                    return (
                      <View
                        key={item.id}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}
                      >
                        <RadioButton value={item.name} color="#ff6666" />
                        <Text>{item.name}</Text>
                      </View>
                    );
                  })}
                </RadioButton.Group>
              )}
            </ScrollView>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={{ ...styles.buttonText, color: "#ff6666" }}>
              Clear Filters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#ff6666",
              paddingHorizontal: 40,
              borderRadius: 10,
              paddingVertical: 10,
            }}
            onPress={filterRestraunts}
            activeOpacity={0.7}
          >
            <Text style={{ ...styles.buttonText, color: "#ffffff" }}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
};

export default FilterSheet;

const styles = StyleSheet.create({
  leftSideContainers: {
    flex: 1,
    marginTop: 10,
    borderLeftColor: "#ff5555",

    alignItems: "center",
    justifyContent: "center",
  },
  subHeadingStyle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    fontSize: 16,
    color: "#6e6e6e",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cecece",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
