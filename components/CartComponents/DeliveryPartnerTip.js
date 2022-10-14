import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const DeliveryPartnerTip = ({partnerTipAmount,setPartnerTipAmount}) => {
  const tipOptions = [10, 20, 50, 100];
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
      }}
    >
      {tipOptions.map((item) => {
        return (
          <Pressable key={item} onPress={()=>{
            if(partnerTipAmount == item){
                setPartnerTipAmount(0)
                return 
            }
            
            setPartnerTipAmount(item)
            
            }}>
            <View
              style={{
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                borderColor: partnerTipAmount == item ? "#ffffff" : "#ff6666",
                backgroundColor: partnerTipAmount == item ? "#ff6666" : "#ffffff",
                
              }}
            >
              <Text style={{
                 color: partnerTipAmount == item ? "#ffffff" : "#ff6666",
                 textAlign:"center"
              }}>{item}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default DeliveryPartnerTip;

const styles = StyleSheet.create({});
