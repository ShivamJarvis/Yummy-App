import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getDistance } from "geolib";
import axios from "axios";
import { API_URL } from "@env";
import Toast from "react-native-simple-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [restraunts, setRestraunts] = useState([]);
  const [popularRestraunts, setPopularRestraunts] = useState([]);
  const [phoneNo, setPhoneNo] = useState("");
  const [loginOtp, setLoginOtp] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cart, setCart] = useState({});
  const [serverCart, setServerCart] = useState({});
  const [cartRestrauntId, setCartRestrauntId] = useState(null);
  const [dishToCart, setDishToCart] = useState(null);
  const [isCartInitialised, setCartInitialised] = useState(false);

  useEffect(() => {
    if (location !== null) {
      const customerLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      axios
        .get(`${API_URL}/restraunt/`)
        .then((data) => {
          const nearRestrauntsData = data.data.filter((item) => {
            var restrauntLocation = {
              latitude: item.latitude,
              longitude: item.longitude,
            };
            var distance = getDistance(customerLocation, restrauntLocation);

            if (distance / 1000 <= item.maximum_delivery_radius) {
              return item;
            }
          });

          setRestraunts(nearRestrauntsData);
        })
        .catch((err) => {});

      axios
        .get(`${API_URL}/restraunt/?rating__gte=4.5&rating__lte=`)
        .then((data) => {
          const nearRestrauntsData = data.data.filter((item) => {
            var restrauntLocation = {
              latitude: item.latitude,
              longitude: item.longitude,
            };
            var distance = getDistance(customerLocation, restrauntLocation);

            if (distance / 1000 <= item.maximum_delivery_radius) {
              return item;
            }
          });

          setPopularRestraunts(nearRestrauntsData);
        })
        .catch((err) => {});
    }
  }, [location, refreshing]);

  const getOTP = async () => {
    try {
      const res = await axios.post(`${API_URL}/user/get-cutomer-otp/`, {
        username: phoneNo,
      });
      const data = res.data;

      if (data.message == "OTP Send") {
        setMessage("OTP Send");
        Toast.show("OTP Send", Toast.LONG);
      }
    } catch (err) {}
  };

  const loginCustomer = async () => {
    setIsLoading(true);
    try {
      const storageRes = await AsyncStorage.getItem("accessToken");
      if (storageRes != null) {
        const res = await axios.get(`${API_URL}/user/cutomer-details/`, {
          headers: { Authorization: `Bearer ${storageRes}` },
        });
        const data = res.data;

        if (data.message == "Success") {
          setUser(data.data);
          setIsAuthenticated(true);
          setAccessToken(storageRes);
        }
      } else {
        setIsAuthenticated(false);
        setAccessToken(null);
      }
    } catch (err) {
      Toast.show("Login Expired", Toast.LONG);
      setIsAuthenticated(false);
      setAccessToken(null);
    }
    setIsLoading(false);
  };

  const loginWithOTP = async (otp) => {
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/user/login-cutomer-otp/`, {
        username: phoneNo,
        otp: otp,
      });
      const data = res.data;

      if (data.message == "User Logined") {
        setAccessToken(data.token.access);
        setRefreshToken(data.token.refresh);

        setMessage("Login Success");

        AsyncStorage.setItem("accessToken", data.token.access);
        AsyncStorage.setItem("refreshToken", data.token.refresh);
        loginCustomer();
      }
      if (data.message == "Wrong OTP or Seems OTP Expired") {
        setMessage("Wrong OTP or OTP is Expired.");
      }
    } catch (err) {
      setIsLoading(false);
      Toast.show("Invalid OTP", Toast.LONG);
    }
  };

  const deleteCart = async () => {
    try {
      await axios.delete(`${API_URL}/restraunt/cart/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {}
  };

  const loadCart = async () => {
   
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await axios.get(`${API_URL}/restraunt/cart/load/`,config);

      if (res.data.status == "success") {
        if (res.data.data == {}) {
          setCartRestrauntId(null);
        } else {
          setCartRestrauntId(res.data.data.restraunt);
        }
        setServerCart(res.data.data);
      }
    } catch (err) {
   
    }
   
  };

  useEffect(() => {
    if (accessToken !== null) {
      loadCart();
      // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    }
  }, [accessToken]);

  const addItemToCart = async (item_id,restrauntId) => {
    
    
    setDishToCart(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axios.post(
        `${API_URL}/restraunt/cart/add-item/`,
        {
          restrauntId: restrauntId,
          itemId: item_id,
        },
        config
      );

      if (res.data.message == "Item Added to Cart") {
        setDishToCart(false)
        return true;
      }
      setDishToCart(false)
      return false;
    } catch (err) {
      setDishToCart(false)
      return false;
    }
  };

  const removeItemToCart = async (item_id,restrauntId) => {
    setDishToCart(true)
    try {
      const res = await axios.post(
        `${API_URL}/restraunt/cart/remove-item/`,
        {
          restrauntId: restrauntId,
          itemId: item_id,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.message == "Item Removed to Cart") {
        setDishToCart(false)
        return true;
      }
      setDishToCart(false)
      return false;
    } catch (err) {
      setDishToCart(false)
      return false;
    }

  };

  const logoutCustomer = () => {
    setIsLoading(true);
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setIsLoading(false);
    setUser(null);
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
    getOTP,
    loginWithOTP,
    message,
    user,
    accessToken,
    loginOtp,
    setLoginOtp,
    cart,
    setCart,
    deleteCart,

    cartRestrauntId,
    setCartRestrauntId,
    addItemToCart,
    removeItemToCart,
    setServerCart,
    serverCart,
    loadCart,
    dishToCart,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const authContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
