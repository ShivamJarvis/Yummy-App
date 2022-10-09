import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import FaIcon from "react-native-vector-icons/FontAwesome";
import IoniIcon from "react-native-vector-icons/Ionicons";
import MiIcon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import DishCard from "../../components/RestrauntComponent/DishCard";
import Accordion from "react-native-collapsible/Accordion";
import FooterComponent from "../../components/FooterComponent";
import Unorderedlist from "react-native-unordered-list";
import axios from "axios";
import LoadingComponent from "../../components/LoadingComponent";
import { API_URL } from "@env";
import CartFloatComponent from "../../components/CartFloatComponent";


const RestrauntDetails = ({ route, navigation }) => {
  let today = new Date();
  const [refreshing, setRefreshing] = useState(false);
  let currentTime = today.toLocaleTimeString("en-SE");
  const { id } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [cartReloading, setCartReloading] = useState(true);
  const [restraunt, setRestraunt] = useState({});
  const [isRestrauntOpen, setRestrauntOpen] = useState(true);



  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [restrauntMenu, setRestrauntMenu] = useState([]);

  const [activeSections, setActiveSections] = useState([]);


  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/restraunt/${id}`)
      .then((data) => {
        setRestraunt(data.data);

        if(currentTime >= data.data.opening_timing && currentTime < data.data.closing_timing){
          setRestrauntOpen(true)
        }
        else{
          setRestrauntOpen(false)
        }

        axios
          .get(`${API_URL}/restraunt/menu-heads/?restraunt=${id}`)
          .then((menuData) => {
            setRestrauntMenu(menuData.data);

            setActiveSections(
              menuData.data.map((item, index) => {
                if (
                  currentTime > item.open_time &&
                  currentTime < item.close_time
                ) {
                  return index;
                }
              })
            );
          });

   

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  
  }, [id, refreshing]);



  if (isLoading) {
    return <LoadingComponent />;
  }

  

  return (
    <SafeAreaView style={{ minHeight: "100%", backgroundColor: "#ffffff" }}>
      <ScrollView
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        >
        
        <View style={styles.topImageContainer}>
          <Image
            source={{
              uri: restraunt.head_image,
            }}
            style={styles.restroImage}
          />

          <TouchableOpacity
            style={styles.backButtonContainer}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={32} style={{ color: "#f78783" }} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 10 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{restraunt.name}</Text>
          </View>

          <View style={styles.restroDetailsContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FaIcon
                name="star"
                style={{ color: "#f78783", opacity: 0.5, marginRight: 5 }}
                size={22}
              />
              <Text
                style={{
                  color: "#f78783",
                  opacity: 0.5,
                  fontSize: 14,
                  fontWeight: "600",
                  marginRight: 5,
                }}
              >
                {restraunt.rating}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IoniIcon
                name="ios-location-sharp"
                style={{ color: "#f78783", opacity: 0.5, marginRight: 5 }}
                size={22}
              />
              <Text
                style={{
                  color: "#f78783",
                  opacity: 0.5,
                  fontSize: 14,
                  fontWeight: "600",
                  marginRight: 5,
                }}
              >
                {restraunt.location}
              </Text>
            </View>
          </View>

          <Text style={{ color: "#595959", marginTop: 10 }}>
            {restraunt.description}
          </Text>
        </View>

        {!isRestrauntOpen && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={require("./../../assets/images/closed.gif")}
              style={{ width: 150, height: 150 }}
            />
          </View>
        )}

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MiIcon
            name="restaurant-menu"
            style={{ marginHorizontal: 30 }}
            size={20}
          />
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Menu</Text>
          <MiIcon
            name="restaurant-menu"
            style={{ marginHorizontal: 30 }}
            size={20}
          />
        </View>

        <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
          <Accordion
            sections={restrauntMenu}
            activeSections={activeSections}
            expandMultiple={true}
            underlayColor="#ffffff"
            duration={100}
            touchableComponent={TouchableOpacity}
            renderHeader={({ name, menu }, index, isActive) => {
              return (
                <View
                  style={{
                    marginBottom: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    {name} ({menu.length})
                  </Text>
                  {isActive ? (
                    <Icon name="chevron-up" size={20} />
                  ) : (
                    <Icon name="chevron-down" size={20} />
                  )}
                </View>
              );
            }}
            renderContent={({ menu }) => {
              return menu.map((dish, index) => {
                return <DishCard  key={dish.id} restrauntName={restraunt.name} restrauntId={id} cartReloading={cartReloading} setCartReloading = {setCartReloading} dish={dish} isRestrauntOpen={isRestrauntOpen}  />;
              });
            }}
            onChange={(active) => setActiveSections(active)}
          />
        </View>

        <View style={{ backgroundColor: "#ebebeb", padding: 10 }}>
          <Text style={{ fontWeight: "700", color: "#757d75" }}>
            Disclaimer :{" "}
          </Text>
          <View
            style={{
              borderBottomColor: "#f7f5f5",
              borderBottomWidth: 1,
              paddingBottom: 10,
            }}
          >
            <Unorderedlist>
              <Text style={{ marginVertical: 10, color: "#757d75" }}>
                All prices are set directly by the restaurant.
              </Text>
            </Unorderedlist>
            <Unorderedlist>
              <Text style={{ marginVertical: 10, color: "#757d75" }}>
                All nutritional information is indicative, values are per serves
                as shared by the restaurant and may vary upon the ingredients
                and portion size.
              </Text>
            </Unorderedlist>
            <Unorderedlist>
              <Text style={{ marginVertical: 10, color: "#757d75" }}>
                An average active adult requuires 2,000 kcal energy per day,
                however, calorie needs may varie.
              </Text>
            </Unorderedlist>
          </View>

          <View
            style={{
              paddingVertical: 20,
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor: "#f7f5f5",
              borderBottomWidth: 1,
            }}
          >
            <Image
              source={require("./../../assets/images/fssai.png")}
              style={{ width: 100, height: 40 }}
            />
            <Text>Licence No. {restraunt.fssai_no}</Text>
          </View>

          <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontWeight: "700" }}>{restraunt.name}</Text>
            <Text>(Outlet : {restraunt.location})</Text>
            <Text>{restraunt.address_line_1}</Text>
            <Text>{restraunt.address_line_2}</Text>
            <Text>{restraunt.address_line_3}</Text>
          </View>
        </View>

        <FooterComponent />
      </ScrollView>
      <CartFloatComponent />
    </SafeAreaView>
  );
};

export default RestrauntDetails;

const styles = StyleSheet.create({
  topImageContainer: {
    position: "relative",
  },
  restroImage: {
    width: "100%",
    height: 200,
  },
  backButtonContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ffffff",
    borderRadius: 200,
    padding: 2,
  },
  titleContainer: {
    paddingTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  restroDetailsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
});
