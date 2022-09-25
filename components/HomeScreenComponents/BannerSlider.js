import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'

const BannerSlider = ({imageUrl}) => {
  return (
    <View style={styles.bannerContainer}>
      <Image source={{uri:imageUrl}} style={{height:"100%",width:"100%",flex:1}} />
    </View>
  )
}

export default BannerSlider

const styles = StyleSheet.create({
  bannerContainer:{
    flexDirection:"row",
    width: Dimensions.get('window').width,
    height: 200,
    paddingHorizontal:10,
    paddingVertical:10,
    marginTop:13
  }
})