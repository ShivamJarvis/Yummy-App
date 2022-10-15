import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import IonIcon from "react-native-vector-icons/Ionicons";
import ADIcon from "react-native-vector-icons/AntDesign";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { authContext } from "./../../contexts/AuthContext";
import FooterComponent from './../../components/FooterComponent'
import {STATIC_URL} from '@env'

const ProfileScreen = ({navigation}) => {
  const { user,logoutCustomer } = authContext();
  console.log(user);
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 18, color: "#ff6666", fontWeight: "700" }}>
          Profile
        </Text>
        <TouchableOpacity activeOpacity={0.8}>
          <IonIcon name="ios-settings-sharp" color={"#ff6666"} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: user.user.profile_photo == null && "#cecece",
              borderRadius: 100,
              padding: 18,
              marginTop: 30,
              elevation:10,
              shadowColor:"#000000"
            }}
          >
            {user.user.profile_photo ? (
              <Image source={{ uri: STATIC_URL+user.user.profile_photo }} style={{width:100,height:100}} />
            ) : (
              <ADIcon name="user" color={"#ffffff"} size={90} />
            )}
          </View>
         {user.user.name && <View style={{  marginTop: 10 }}>
     
            <Text
              style={{
                marginLeft: 5,
                fontSize: 24,
                color: "#2e2e2e",
                fontWeight: "700",
              }}
            >
              {user.user.name}
            </Text>
          </View>}
          <View style={{ ...styles.tabContainer, marginTop: 10 }}>
            <IonIcon name="md-call-sharp" color="#2e2e2e" size={20} />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 18,
                color: "#2e2e2e",
                fontWeight: "700",
              }}
            >
              {user.user.mobile_no}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 10, marginTop: 30 }}>
          <Text style={{ fontSize: 18, color: "#2e2e2e", fontWeight: "700",marginBottom:10 }}>
            My Account
          </Text>
          
          <TouchableOpacity style={styles.clickContainer} activeOpacity={0.8} >
            <View style={styles.tabContainer}>
              <FAIcon name="user-o" size={20} color="#ff6666" />
              <Text style={styles.tabTitle}>Manage Profile</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clickContainer} activeOpacity={0.8} onPress={()=>{
            navigation.navigate("ActiveOrderDetailScreen", {
              order_id: "O9DFQKGHH6",
            });
          }} >
            <View style={styles.tabContainer}>
              <IonIcon name="ios-reorder-three-outline" size={20} color="#ff6666" />
              <Text style={styles.tabTitle}>My Orders</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clickContainer} activeOpacity={0.8} >
            <View style={styles.tabContainer}>
              <FAIcon name="heart-o" size={20} color="#ff6666" />
              <Text style={styles.tabTitle}>My Favourites</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clickContainer} activeOpacity={0.8} >
            <View style={styles.tabContainer}>
              <FAIcon name="address-book-o" size={20} color="#ff6666" />
              <Text style={styles.tabTitle}>Manage Addresses</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clickContainer} activeOpacity={0.8} >
            <View style={styles.tabContainer}>
              <IonIcon name="help-circle-outline" size={20} color="#ff6666" />
              <Text style={styles.tabTitle}>Help</Text>
            </View>
          </TouchableOpacity>


        </View>

        <View style={{ paddingHorizontal: 10, marginTop: 30 }}>
          <Text style={{ fontSize: 18, color: "#2e2e2e", fontWeight: "700",marginBottom:10 }}>
            Other
          </Text>
          
          <TouchableOpacity style={styles.clickContainer} activeOpacity={0.8} >
            <View style={styles.tabContainer}>
              <IonIcon name="notifications-outline" size={20} color="#ff6666" />
              <Text style={styles.tabTitle}>Notifications</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clickContainer} activeOpacity={0.8} onPress={logoutCustomer} >
            <View style={styles.tabContainer}>
              <ADIcon name="logout" size={20} color="#ff6666" />
              <Text style={styles.tabTitle}>Logout</Text>
            </View>
          </TouchableOpacity>

         
          


        </View>
        

        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clickContainer: {
    width:Dimensions.get('window').width - 30,
    alignSelf:"center",
    marginVertical: 5,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#e3e1e1",
  },
  tabTitle: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "700",
    color: "#3d3d3d",
  },
});
