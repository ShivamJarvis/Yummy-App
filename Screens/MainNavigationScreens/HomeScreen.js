import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "./../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from "../../components/HeaderComponent";
import CategoriesCard from "../../components/HomeScreenComponents/CategoriesCard";
import SmallRestrauntCard from "../../components/HomeScreenComponents/SmallRestrauntCard";

import BannerSlider from "../../components/HomeScreenComponents/BannerSlider";
import FooterComponent from "../../components/FooterComponent";
import CartFloatComponent from "../../components/CartFloatComponent";
import axios from "axios";
import { API_URL } from "@env";
import { getDistance } from "geolib";
import LoadingComponent from "../../components/LoadingComponent";
import Carousel from "react-native-snap-carousel";
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './../../components/HomeScreenComponents/CarouselCardItem'


const HomeScreen = ({ navigation }) => {
  const [sectionedRestraunts, setSectionedRestraunts] = useState([]);
  const [carouselData, setCarouselData] = useState([]);
  const [cuisineData, setCuisineData] = useState([]);
  const isCarousel = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logoutCustomer, user, setRefreshing, refreshing, globalCoordinates } =
    authContext();
  const cleanStorage = async () => {
    await AsyncStorage.clear();

    logoutCustomer();
  };

  const getBannerData = async() => {
    try {
      const res = await axios.get(`${API_URL}/restraunt/banner/`);
      setCarouselData(res.data)
    } catch (err) {
     
    }
  }

  const getCuisineData = async() => {
    try {
      const res = await axios.get(`${API_URL}/restraunt/cuisine/`);
      setCuisineData(res.data)
    } catch (err) {
     
    }
  }

  const getSectionedRestrauntsData = async () => {
    try {
      const customerLocation = {
        latitude: globalCoordinates.latitude,
        longitude: globalCoordinates.longitude,
      };
      const res = await axios.get(`${API_URL}/restraunt/sections/`);
      const nearRestrauntsData = res.data.map((item) => {
        var filteredItem = item.restraunts.filter((restraunt) => {
          var restrauntLocation = {
            latitude: restraunt.latitude,
            longitude: restraunt.longitude,
          };

          var distance = getDistance(customerLocation, restrauntLocation);

          if (distance / 1000 <= restraunt.maximum_delivery_radius) {
            return restraunt;
          }
        });

        return { ...item, restraunts: filteredItem };
      });

      setSectionedRestraunts(nearRestrauntsData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (globalCoordinates != null) {
      setIsLoading(true);

      getSectionedRestrauntsData();
    }
  }, [globalCoordinates, refreshing]);

  useEffect(()=>{
    getCuisineData()
    getBannerData()
  },[])

 

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView
      style={{
        minHeight: "100%",
        maxWidth: "100%",
        backgroundColor: "#ffffff",
        marginHorizontal: 5,
      }}
    >
      <StatusBar backgroundColor={"#f78783"} />
      <HeaderComponent />
      {/* <TouchableOpacity onPress={cleanStorage}>
        <Text>Clean Async Storage {user?.id}</Text>
      </TouchableOpacity> */}

      <ScrollView
        style={{ flex: 1, marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories */}
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
        
            <View style={{marginTop:20}}>

        <Carousel
          layout="tinder"
          layoutCardOffset={1}
          loop={true}
          autoplay={true}
          hasParallaxImages={true}

          ref={isCarousel}
          data={carouselData}
          renderItem={CarouselCardItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={SLIDER_WIDTH}
          inactiveSlideShift={0}
          useScrollView={true}
          />
          </View>
        {/* Popular Resturants */}

        {sectionedRestraunts &&
          sectionedRestraunts.map((data) => {
            if (data.restraunts.length > 0) {
              return (
                <View key={data.id} style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    {data.name}
                  </Text>
                  <FlatList
                    style={{ marginTop: 20 }}
                    data={data.restraunts}
                    renderItem={({ item, index }) => (
                      <SmallRestrauntCard
                        item={item}
                        key={item.id}
                        navigation={navigation}
                      />
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              );
            }
          })}

        <View>
          <FooterComponent />
        </View>
      </ScrollView>
      <CartFloatComponent />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
