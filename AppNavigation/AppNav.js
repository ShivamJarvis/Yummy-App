import { NavigationContainer } from '@react-navigation/native';
import LoginNavigation from './LoginNavigation';
import MainNavigation from './MainNavigation';
import {authContext} from './../contexts/AuthContext'
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import LoadingComponent from '../components/LoadingComponent';
import Toast from 'react-native-simple-toast';
import RequestLocationPermission from '../Screens/HelperScreens/RequestLocationPermission';


export default function AppNav() {
  const {isAuthenticated, setLocation,loginCustomer,setGlobalCoordinates} = authContext()

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGraned] = useState(false);

  
  useEffect(() => {
    (async () => {
      try{

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Toast.show('Permission to access location was denied', Toast.LONG);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocationPermissionGraned(true)
      setLocation(location);

      setGlobalCoordinates({'latitude':location.coords.latitude,'longitude':location.coords.longitude})
     
    
      setLoading(false)

      loginCustomer()

    }catch(err){
      
    }
    })();
  }, []);

    if(loading){
      return <LoadingComponent />
    }

    if(!locationPermissionGranted){
      return <RequestLocationPermission />
    }
  
    return (
      
      <NavigationContainer>
       {isAuthenticated ? <MainNavigation /> : <LoginNavigation />}

       
        
      </NavigationContainer>
      
    );

}

