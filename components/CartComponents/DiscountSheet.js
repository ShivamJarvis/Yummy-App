import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import RBSheet from "react-native-raw-bottom-sheet";


const DiscountSheet = ({ discountSeetRef, cartTotal, discountCoupons,setCouponDiscount,setSelectedCoupon }) => {
  
    const handleCouponDiscount = (coupon) => {
        if(cartTotal < coupon.minimum_cart_amount ){
            return
        }
        var actualCalculatedDiscount = Math.round((cartTotal * coupon.discount_percentage) / 100)
        if(actualCalculatedDiscount > coupon.discount_amount_limit){
            setCouponDiscount(coupon.discount_amount_limit)
        }
        else{
            setCouponDiscount(actualCalculatedDiscount)
        }
        setSelectedCoupon(coupon)
        discountSeetRef.current.close()
    }

  return (
    <RBSheet
      ref={discountSeetRef}
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
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <Text
            style={{
              fontSize: 18,
              color: "#242323",
              fontWeight: "700",
              marginTop: 10,
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            Apply Coupon
          </Text>
          <Text style={{ textAlign: "center",fontSize:13 }}>
            Your cart total : {cartTotal}
          </Text>
          <View style={{borderBottomWidth:1,borderStyle:"dashed",borderBottomColor:"#000000",marginVertical:15}}></View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {discountCoupons.map((coupon) => {
                if(cartTotal >= coupon.minimum_cart_amount){

                
              return (
                <View key={coupon.id} style={styles.coupon}>
                  <View style={styles.discountPercentContainer}>
                    <Text style={styles.couponDiscount}>
                      {coupon.discount_percentage}% OFF
                    </Text>
                  </View>
                  <View style={styles.descriptionContainer}>
                    <View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:5}}>

                  <Text style={styles.couponCode}>{coupon.code}</Text>
                  <TouchableOpacity onPress={()=>handleCouponDiscount(coupon)} activeOpacity={0.7}>
                    <Text style={{color:"#ff6666",fontSize:16,fontWeight:"700"}}>APPLY</Text>
                  </TouchableOpacity>
                    </View>
                    <View style={{borderBottomWidth:1,borderStyle:"dashed",borderBottomColor:"#000000",marginVertical:15}}></View>
                    <Text style={{color:"#c3c3c3",fontWeight:"700",fontSize:13,textAlign:"justify"}}>
                        {coupon.description}
                    </Text>
                  </View>
                </View>
              );
            }
            })}
          </ScrollView>
        </View>
      </View>
    </RBSheet>
  );
};

export default DiscountSheet;

const styles = StyleSheet.create({
  coupon: {
    borderRadius: 10,
    minHeight: 130,
    borderColor: "#ff6666",
    flexDirection: "row",
    shadowColor: "#000000",
    marginVertical:15,
    borderRightWidth:1,
    borderBottomWidth:1,
    borderTopWidth:1
  },
  discountPercentContainer: {
    backgroundColor: "#ff6666",
    
    borderLeftWidth: 4,

    borderStyle: "dashed",
    borderColor: "#ffffff",
    justifyContent: "center",
  },
  couponDiscount: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    transform: [{ rotate: "-90deg" }],
  },
  descriptionContainer:{
    flex:2, 
    padding:5,
    paddingHorizontal:10
  },
  couponCode:{
    fontSize:16,
    fontWeight:"700",
    
  },
});
