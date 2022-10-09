import { StyleSheet, Text, View,TouchableOpacity,ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from "react-native-vector-icons/Feather";
import axios from 'axios'
import { authContext } from '../../contexts/AuthContext';
import { API_URL } from "@env";

import CartItemCard from '../../components/CartComponents/CartItemCard';

const CartScreen = ({navigation}) => {
    const {accessToken} = authContext()
    const [cartDetails,setCartDetails] = useState({})
    const [cartReloading, setCartReloading] = useState(false);

    const getCartDetails = async() => {
        try{

            const res = await axios.get(`${API_URL}/restraunt/cart/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            setCartDetails(res.data.data)
        }catch(err){
            

        }
    }

    useEffect(()=>{
        getCartDetails()
        setCartReloading(false)
    },[cartReloading])

  return (
    <SafeAreaView style={{height:"100%",backgroundColor:"#ffffff"}}>
      <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={35} style={{ color: "#f78783" }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{cartDetails?.restraunt?.name}</Text>
        </View>
        
        <ScrollView style={{backgroundColor:"#ffffff",}} >
            <View style={styles.cartItemsContainer}>
                {cartDetails.cart?.map(item=><CartItemCard item={item} cartReloading={cartReloading} setCartReloading = {setCartReloading} restrauntId={cartDetails?.restraunt?.id} key={item.id} />)}
            </View>
        </ScrollView>

    </SafeAreaView>
  )
}

export default CartScreen

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical:10,
        paddingHorizontal:5,
        flexDirection:"row",
        alignItems:"center"
      },
      headerTitle:{
        fontWeight:"700",
        fontSize:16
      },
      cartItemsContainer:{
        width:Dimensions.get('window').width - 20,
        borderRadius:10,
        minHeight:50,
        backgroundColor:"#ffffff",
        alignSelf:"center",

        marginVertical:20,
        elevation:20,
        shadowColor:"#000000",
        paddingHorizontal:10,
        paddingVertical:10
      }
      
     
})