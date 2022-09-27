import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import Svg, { Path } from "react-native-svg";
import LoadingComponent from './../../components/LoadingComponent'



import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {authContext} from './../../contexts/AuthContext'
import AsyncStorage from "@react-native-async-storage/async-storage";



const CELL_COUNT = 6;

const VerificationCode = ({ navigation }) => {
  const {phoneNo,loginWithOTP,setLoginOtp,isLoading,isAuthenticated} = authContext()
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleUserOTP = () =>{
    setLoginOtp(value)
    loginWithOTP(value)
    
  }

  if(isLoading){
    return <LoadingComponent />
  }

  return (
    <View style={{ height: "100%" }}>
      
      <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerText}>Verification Code</Text>
          </View>

          <View style={{ width: 20 }} />
        </View>
      </SafeAreaView>

      <View>
        <View style={styles.svgWrapper}>
          <Svg viewBox="0 0 1440 320">
            <Path
              fill={"#f78783"}
              d="M0,128L24,154.7C48,181,96,235,144,266.7C192,299,240,309,288,261.3C336,213,384,107,432,90.7C480,75,528,149,576,154.7C624,160,672,96,720,69.3C768,43,816,53,864,85.3C912,117,960,171,1008,160C1056,149,1104,75,1152,42.7C1200,11,1248,21,1296,42.7C1344,64,1392,96,1416,112L1440,128L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
            />
          </Svg>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Confirmation</Text>
        <Text style={styles.subTitle}>
          Please enter verification code send to 
        </Text>
        <Text style={styles.subTitle}> +91 {phoneNo}</Text>

        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />

      <View style={{flexDirection:"row",alignItems:"center"}}>
        <Text>Don't Recieve OTP? </Text>
        <TouchableOpacity style={styles.resendOTPContainer}>
          <Text style={styles.resendOTPtitle}>Resend OTP</Text>
        </TouchableOpacity>
      </View>

        <TouchableOpacity style={styles.verifyOTPButton} onPress={handleUserOTP}>
          <Text style={styles.buttonTitle}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerificationCode;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  headerText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 18,
  },

  svgWrapper: {
    backgroundColor: "#ffffff",
    height: 100,
  },
  content: {
    backgroundColor: "#f78783",
    flex: 1,
    marginTop: -10,
    paddingHorizontal: 10,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 10,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subTitle: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },

  root: { flex: 1, padding: 20 },
  otpTitle: { textAlign: "center", fontSize: 26 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#ffffff",
    textAlign: "center",
    color: "#ffffff",
  },
  focusCell: {
    borderColor: "#ffffff",
  },

  resendOTPContainer:{
    marginVertical:30
  },
  resendOTPtitle:{
    color: "#ffffff",
    fontSize:14
  },
  verifyOTPButton:{
    borderRadius:20,
    borderWidth:1,
    borderColor:"#ffffff",
    paddingVertical:10,
    textAlign:"center"
  },
  buttonTitle:{
    color: "#ffffff",
    textAlign:"center",
    fontWeight:"bold",
    fontSize:18
  },
});
