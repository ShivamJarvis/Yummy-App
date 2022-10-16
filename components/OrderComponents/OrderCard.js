import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";


const OrderCard = ({item}) => {
  const navigation = useNavigation()
  return (
    <View style={{borderBottomColor:"#cecece",borderBottomWidth:1}}>

    <TouchableOpacity style={styles.itemContainer} onPress={()=>{
      if(item.order_status=="Delivered"){
        return navigation.navigate("DeliveredOrderedDetailScreen",{
          order_id: item.order_id,
        })
      }
      navigation.navigate("ActiveOrderDetailScreen", {
        order_id: item.order_id,
      });
    }}>
      <View style={styles.row}>
        <View>

        <Text style={styles.restrauntName}>{item.restraunt.name}</Text>
        <Text style={{fontSize:12,color:"#6e6e6e",marginVertical:2,fontWeight:"700"}}>{item.restraunt.location}</Text>
        <View style={{...styles.row,justifyContent:"flex-start"}}>

        <Text style={{fontSize:12,color:"#6e6e6e",marginVertical:2,fontWeight:"700"}}>₹{item.order_net_amount}</Text>
        <IonIcon name="chevron-forward" color={"#6e6e6e"} />
        </View>
        </View>
        <View style={styles.row}>
        <Text>{item.order_status=="Delivered" ? "Delivered" : "Active"}</Text>
        {item.order_status=="Delivered"? <IonIcon name="checkmark-done-circle" size={20} color={"#ff6666"} />  : <Image
                source={require("./../../assets/images/pulse.gif")}
                style={{ width: 30, height: 30 }}
                />}
        </View>
      </View>

        <View style={{borderBottomColor:"#000000",borderBottomWidth:1,borderStyle:"dashed", marginVertical:5}}>

        </View>

        <View>
            <Text style={{fontSize:13,color:"#6e6e6e"}}>
                {item.order.map(order_item=>{
                  return `${order_item.item.item_name} X (${order_item.qty})`
                }).join(', ')}
            </Text>
            <Text style={{fontSize:11,color:"#cecece"}}>{item.order_date}</Text>
        </View>

    </TouchableOpacity>
</View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  itemContainer:{
    paddingHorizontal:15,
    marginVertical:15,
    
    },
    row:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    restrauntName:{
        fontWeight:"700",
        fontSize:15
    },
});
