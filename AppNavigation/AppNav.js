import { NavigationContainer } from '@react-navigation/native';
import LoginNavigation from './LoginNavigation';
import MainNavigation from './MainNavigation';
import {authContext} from './../contexts/AuthContext'
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import LoadingComponent from '../components/LoadingComponent';
import Toast from 'react-native-simple-toast';


export default function AppNav() {
  const {isAuthenticated, setLocation,loginCustomer} = authContext()

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  
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
      setLocation(location);
     
    
      setLoading(false)

      loginCustomer()

    }catch(err){
      
    }
    })();
  }, []);

    if(loading){
      return <LoadingComponent />
    }
  
    return (
      
      <NavigationContainer>
       {isAuthenticated ? <MainNavigation /> : <LoginNavigation />}

       
        
      </NavigationContainer>
      
    );

}

