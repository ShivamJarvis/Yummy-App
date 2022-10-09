import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icons from 'react-native-vector-icons/FontAwesome'

const FooterComponent = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>Hundreds of flavors under one roof.</Text>
      <Text style={styles.footerSubTitle}>Crafted with <Icons name="heartbeat" size={30} style={{color:"#ff0000"}}  />  By Coding Brewing</Text>
    </View>
  )
}

export default FooterComponent

const styles = StyleSheet.create({
    footerContainer:{
        paddingVertical:30,
        paddingHorizontal:10,
        marginBottom:60
        
    },  
    footerTitle:{
       fontSize:35,
       fontWeight:"700",
       color:"#cecece"
        
    },  
    footerSubTitle:{
       fontSize:22,
       fontWeight:"600",
       color:"#cecece",
       marginTop:10
        
    },  
})