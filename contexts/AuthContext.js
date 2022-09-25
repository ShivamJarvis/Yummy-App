import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getDistance } from 'geolib';
import axios from 'axios';
import {API_URL} from '@env'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [restraunts, setRestraunts] = useState([]);
  const [popularRestraunts, setPopularRestraunts] = useState([]);
  const [phoneNo, setPhoneNo] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(()=>{
    if(location !== null){

    
    const customerLocation = {
      "latitude": location.coords.latitude,
      "longitude": location.coords.longitude,
    }


    axios.get(`${API_URL}/restraunt/`).then(data=>{

      const nearRestrauntsData = data.data.filter(item=>{
        var restrauntLocation = {
          "latitude": item.latitude,
          "longitude": item.longitude,
        }
        var distance = getDistance(
          customerLocation,
          restrauntLocation
        );

        if(distance/1000 <= item.maximum_delivery_radius){
          return item
        }
       
      })

      setRestraunts(nearRestrauntsData)
    }).catch(err=>{

    })
 

  axios.get(`${API_URL}/restraunt/?rating__gte=4.5&rating__lte=`).then(data=>{

    const nearRestrauntsData = data.data.filter(item=>{
      var restrauntLocation = {
        "latitude": item.latitude,
        "longitude": item.longitude,
      }
      var distance = getDistance(
        customerLocation,
        restrauntLocation
      );

      if(distance/1000 <= item.maximum_delivery_radius){
        return item
      }
      
    })
  

    setPopularRestraunts(nearRestrauntsData)
  }).catch(err=>{

  })
    }


  },[location,refreshing])

  const loginCustomer = () => {
    setIsLoading(true);
    AsyncStorage.getItem("isAuthenticated")
      .then((value) => {
        if (value == "true") {
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const logoutCustomer = () => {
    setIsLoading(true);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const values = {
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    phoneNo,
    setPhoneNo,
    loginCustomer,
    logoutCustomer,
    location,
    setLocation,
    locationName,
    setLocationName,
    restraunts,
    setRestraunts,
    setRefreshing,
    refreshing,
    popularRestraunts,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const authContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
