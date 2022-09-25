import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoadingComponent = () => {
  return (
    <SafeAreaView style={{justifyContent:"center",alignItems:"center",flexDirection:"row",flex:1}}>
      <ActivityIndicator style={{}} size={45} color="#FF6666" />
    </SafeAreaView>
  )
}

export default LoadingComponent

const styles = StyleSheet.create({})