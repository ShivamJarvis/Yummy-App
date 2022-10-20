import { StyleSheet, Text, View,Image, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {authContext} from './../../contexts/AuthContext'
import LoadingComponent from '../../components/LoadingComponent';



const LoginScreen = ({navigation}) => {
    const {setPhoneNo,phoneNo,loginCustomer,isLoading,message,getOTP} = authContext()
    const handleUserInput = () => {
        getOTP()
        
        navigation.navigate("VerificationCode")
    }

    const handleUserPressInput = (text) => {
        setPhoneNo(text)
        
    }

    useEffect(()=>{
    loginCustomer()

    },[])

    if(isLoading){
        return <LoadingComponent />
    }

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={"#f78783"} barStyle="light-content" />
    <SafeAreaView style={styles.headerWrapper}>
      
      <View style={styles.header}>
       
        <View>
            <Text style={styles.headerText}>Login / Register</Text>
        </View>

      </View>

        <View style={styles.splash}>
            <Image source={require("../../assets/images/Yummy-1-white.png")} style={{width:300,height:80}} />
        </View>

    </SafeAreaView>

    <View style={styles.content}>
        <View>
            <Text style={styles.title}>Personal Information &gt;</Text>
        </View>

        <View style={styles.inputContainer}>
            <Text style={{fontSize:16}}>(+91)</Text>
            <TextInput cursorColor={"#ff6666"} style={styles.inputText} placeholder='Your Phone Number' onChangeText={handleUserPressInput} keyboardType='number-pad' />
        </View>
        <View style={{marginBottom:20}}>

            <Text style={{color:"gray", textAlign:"center",fontWeight:"500"}}>
                We will send you a verification code to your phone number.
            </Text>


        </View>

        <View style={styles.buttonWrapper}>

            <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleUserInput}>
                <Icon name='arrow-right' size={25} style={{color: "#ffffff"}} />
            </TouchableOpacity>
        </View>

    </View>


    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    'container':{
        backgroundColor:'#f7f7f7'
    },  
    'headerWrapper':{
        backgroundColor:'#f78783',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
    },  
    
    'header':{
        padding: 20,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },  

    'headerText':{
       fontWeight:"bold",
       color: "#fff",
       fontSize:18
    },  
    'splash':{
        paddingTop:60,
        paddingBottom:160,
        alignItems:"center",
    },
    'content':{
        marginHorizontal: 20,
        paddingHorizontal:20,
        backgroundColor:"#ffffff",
        borderRadius:15,
        marginTop:-60,
    },
    'title':{
        fontWeight:"bold",
        fontSize:18,
        color: "#2d2d2d",
        paddingVertical:20,
    },
    'inputContainer':{
        flexDirection:'row',
        alignItems:"center",
        marginVertical:20,
        paddingVertical:10,
        paddingHorizontal:20,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#f7f7f7"

    },
    'inputText':{
       marginLeft:10,
       flex: 1,

    },
  
    'buttonWrapper':{
       alignItems:'center',
       marginBottom:20,

    },
    'button':{
       backgroundColor:"#f78783",
       borderRadius:50,
       padding: 20,
       marginBottom:20,
      

    },
  
})