import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "./../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from "../../components/HeaderComponent";
import CategoriesCard from "../../components/HomeScreenComponents/CategoriesCard";
import SmallRestrauntCard from "../../components/HomeScreenComponents/SmallRestrauntCard";

import BannerSlider from "../../components/HomeScreenComponents/BannerSlider";
import FooterComponent from "../../components/FooterComponent";

const HomeScreen = ({ navigation }) => {
  const width = Dimensions.get("window").width;
  const { logoutCustomer, user, restraunts,setRefreshing,refreshing,popularRestraunts } = authContext();
  const cleanStorage = async () => {
    await AsyncStorage.clear();

    logoutCustomer();
  };

  const categroiesData = [
    {
      id: 1,
      title: "Indian",
      imageUrl:
        "https://www.cypressgreen.in/blog/wp-content/uploads/2021/03/food.jpg",
    },
    {
      id: 2,
      title: "Italian",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5e484ab628c78d6f7e602d73/1599248222831-ZMHAFYJT9T3IXH3IVGKY/What-to-eat-in-Italy.png",
    },
    {
      id: 3,
      title: "Chinese",
      imageUrl:
        "https://assets.gqindia.com/photos/5dd2390c836a7f0008bf47d9/master/pass/top-image.jpg",
    },
    {
      id: 4,
      title: "Japaenese",
      imageUrl:
        "https://assets.traveltriangle.com/blog/wp-content/uploads/2018/05/gimbap_700x500.jpg",
    },
    {
      id: 5,
      title: "Burmese",
      imageUrl:
        "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/10/03/16/lahpet-1.jpg?width=1200",
    },
    {
      id: 6,
      title: "Thai",
      imageUrl:
        "https://a.cdn-hotels.com/gdcs/production109/d913/52127df7-ccff-4762-8255-01b3ba749fca.jpg",
    },
    {
      id: 7,
      title: "Korean",
      imageUrl:
        "https://static.toiimg.com/thumb/82085026.cms?resizemode=4&width=1200",
    },
  ];

  const restrauntsData = [
    {
      id: 1,
      title: "Subway",
      time: "31",
      imageUrl:
        "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/wmd1bvw4xe7cjqwyq6xr",
    },
    {
      id: 2,
      title: "Sagar Ratna",
      time: "47",
      imageUrl:
        "https://media-cdn.tripadvisor.com/media/photo-s/11/85/2a/9a/nice-dosa.jpg",
    },
    {
      id: 3,
      title: "Haldiram's",
      time: "35",
      imageUrl:
        "https://fastly.4sqi.net/img/general/600x600/6085279_2CAIzhWATOzge21Fd88Vq3v0U3Qtc2H7sbFvgjvDoEc.jpg",
    },
    {
      id: 4,
      title: "Fassos - Wraps & Rolls",
      time: "36",
      imageUrl:
        "https://res.cloudinary.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/iztibmfdzt5fnjrveuyh",
    },
    {
      id: 5,
      title: "Burger King",
      time: "38",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/0/18225860/e01ffc3a4d1f4a76e63b3250299f4793.jpg",
    },
    {
      id: 6,
      title: "Dominos",
      time: "30",
      imageUrl:
        "https://media-cdn.tripadvisor.com/media/photo-s/18/a2/89/c3/dominooooooooooo.jpg",
    },
    {
      id: 7,
      title: "Wow! Momo",
      time: "31",
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/chains/6/18082196/906553a70e6f4f0870e28e663058af1f_featured_v2.jpg",
    },
  ];

  const carouselData = [
    {
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/chains/6/18082196/906553a70e6f4f0870e28e663058af1f_featured_v2.jpg",
    },
    {
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/chains/6/18082196/906553a70e6f4f0870e28e663058af1f_featured_v2.jpg",
    },
    {
      imageUrl:
        "https://b.zmtcdn.com/data/pictures/chains/6/18082196/906553a70e6f4f0870e28e663058af1f_featured_v2.jpg",
    },
  ];

  

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView
      style={{
        minHeight: "100%",
        maxWidth: "100%",
        backgroundColor: "#ffffff",
        margin: 5,
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
          data={categroiesData}
          renderItem={({ item, index }) => (
            <CategoriesCard
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        {/* Offers Banners */}
        <FlatList
          data={carouselData}
          centerContent={true}
          renderItem={({ item, index }) => (
            <BannerSlider imageUrl={item.imageUrl} />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        {/* Popular Resturants */}
        
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>
            Popular Brands
          </Text>
          <FlatList
            style={{ marginTop: 20 }}
            data={popularRestraunts}
            renderItem={({ item, index }) => (
              <SmallRestrauntCard item={item} navigation={navigation} />
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* Tasty Discounts */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>
            Tasty Discounts
          </Text>
          <FlatList
            style={{ marginTop: 20 }}
            data={restraunts}
            renderItem={({ item, index }) => (
              <SmallRestrauntCard item={item} navigation={navigation} />
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* Newly Added Resturants */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Newly Added</Text>
          <FlatList
            style={{ marginTop: 20 }}
            data={restraunts}
            renderItem={({ item, index }) => (
              <SmallRestrauntCard item={item} navigation={navigation} />
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View>
          <FooterComponent />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
