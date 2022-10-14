import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"

export const SLIDER_WIDTH = Dimensions.get('window').width 
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.container} key={index}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: Dimensions.get('window').width ,
    paddingBottom: 40,
    shadowColor: "#000",

    
    
  },
  image: {
    width: Dimensions.get('window').width ,
    height:150,
    borderRadius:10,
  },
  
  
})

export default CarouselCardItem