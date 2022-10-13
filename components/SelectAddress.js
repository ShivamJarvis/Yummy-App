import { StyleSheet, Text, View,ScrollView,TouchableOpacity } from 'react-native'
import React,{useRef} from 'react'
import FeatherIcon from "react-native-vector-icons/Feather";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { authContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SelectAddress = ({newAddressSheetRef}) => {
  const {userAddresses,setGlobalCoordinates, setSelectedAddress} = authContext()
  const navigation = useNavigation()
  
  return (
    
    <RBSheet
    ref={newAddressSheetRef}
   
    openDuration={250}
    customStyles={{
      container: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight:10
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
      <View style={{ marginHorizontal: 20, flex: 1, marginTop: 10 }}>
        <Text
          style={{
            fontSize: 20,
            color: "#242323",
            fontWeight: "700",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Choose a delivery address
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {userAddresses &&
            userAddresses.map((address) => {
              return (
                <TouchableOpacity
                  key={address.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedAddress(address);
                    setGlobalCoordinates({'latitude':address.latitude,'longitude':address.longitude})
                    newAddressSheetRef.current.close();
                  }}
                  style={{marginBottom:10}}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      margin: 5,
                    }}
                  >
                    {address.address_type == "Home" && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "#cecece",
                          borderRadius: 5,
                          padding: 5,
                          marginRight: 10,
                        }}
                      >
                        <IonIcon
                          name="home-sharp"
                          color={"#f78783"}
                          size={22}
                        />
                      </View>
                    )}
                    {address.address_type == "Work" && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "#cecece",
                          borderRadius: 5,
                          padding: 5,
                          marginRight: 10,
                        }}
                      >
                        <MCIcon
                          name="office-building-marker-outline"
                          color={"#f78783"}
                          size={22}
                        />
                      </View>
                    )}
                    {address.address_type == "Friends & Family" && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "#cecece",
                          borderRadius: 5,
                          padding: 5,
                          marginRight: 10,
                        }}
                      >
                        <FAIcon name="users" color={"#f78783"} size={22} />
                      </View>
                    )}
                    {address.address_type == "Other" && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "#cecece",
                          borderRadius: 5,
                          padding: 5,
                          marginRight: 10,
                        }}
                      >
                        <FAIcon name="location-arrow" color={"#f78783"} size={22} />
                      </View>
                    )}
                    <View>
                      <Text style={{ fontWeight: "700" }}>
                        {address.address_type}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 12, color: "#7e7e7e" }}
                      >
                        {address.address_line_1}, {address.address_line_2},{" "}
                        {address.address_line_3}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    </View>

    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 10,
        marginBottom: 10,
   
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddAddressScreen");
        }}
        activeOpacity={0.7}
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#FF6666",
          borderWidth: 1,
          paddingVertical: 10,
          marginHorizontal: 10,
          marginBottom: 10,
          borderRadius: 10,
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: "#FF6666",
            textAlign: "center",
          }}
        >
          Add New Address
        </Text>
      </TouchableOpacity>
    </View>
  </RBSheet>
  )
}

export default SelectAddress

const styles = StyleSheet.create({})