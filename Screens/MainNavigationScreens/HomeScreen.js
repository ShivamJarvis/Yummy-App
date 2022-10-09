import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  StatusBar,
  TouchableOpacity
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authContext } from "./../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from "../../components/HeaderComponent";
import CategoriesCard from "../../components/HomeScreenComponents/CategoriesCard";
import SmallRestrauntCard from "../../components/HomeScreenComponents/SmallRestrauntCard";

import BannerSlider from "../../components/HomeScreenComponents/BannerSlider";
import FooterComponent from "../../components/FooterComponent";
import CartFloatComponent from "../../components/CartFloatComponent";

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
      <CartFloatComponent />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
