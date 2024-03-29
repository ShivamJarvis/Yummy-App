import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const [globalCoordinates, setGlobalCoordinates] = useState({});
  const [cartRestrauntId, setCartRestrauntId] = useState(null);
  const [dishToCart, setDishToCart] = useState({ itemId: null, status: false });
  const [customisedIsNotRemoved, setCustomisedIsNotRemoved] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
    const [cuisineData, setCuisineData] = useState([]);

    
  const [filters,setFilters] = useState([
    {
      heading:"Sort",
      subHeading:"SORT BY",
      multiSelect:false,
      isChanged:false,
      selectedOption:"",
      options:[
        {
          id:0,
          name:"Rating",
          is_selected:false
        },
        {
          id:1,
          name:"Cost: Low To High",
          is_selected:false
        },
        {
          id:2,
          name:"Cost: High To Low",
          is_selected:false
        },
      ]
    },
    {
      heading:"Explore",
      subHeading:"EXPLORE",
      multiSelect:true,
      selectedOption:[],
      isChanged:false,
      options:[
        {
          name:"New on Yummy",
          is_selected:false
        },
        {
          name:"Yummy Exclusive",
          is_selected:false
        },
      ]
    },
    {
      heading:"Cuisines",
      subHeading:"FILTER BY CUISINE",
      multiSelect:true,
      isChanged:false,
      selectedOption:[],
      options:cuisineData
    },
    {
      heading:"Ratings",
      subHeading:"FILTER BY",
      multiSelect:true,
      isChanged:false,
      selectedOption:[],
      options:[
        {
          name:"Rating 4.5+",
          is_selected:false
        },
        {
          name:"Rating 4.0+",
          is_selected:false
        },
        {
          name:"Rating 3.5+",
          is_selected:false
        },
      ]
    },
    {
      heading:"Veg/Non-Veg",
      subHeading:"FILTER BY",
      multiSelect:false,
      selectedOption:"",
      isChanged:false,
      options:[
        {
          id:3,
          name:"Pure Veg",
          is_selected:false
        },
        {
          id:4,
          name:"Non Veg",
          is_selected:false
        },
        {
          id:5,
          name:"Both",
          is_selected:true
        },
      ]
    },
    {
      heading:"Cost for two",
      subHeading:"FILTER BY",
      multiSelect:true,
      isChanged:false,
      selectedOption:[],
      options:[
        {
          name:"Rs. 200-Rs. 500",
          is_selected:false
        },
        {
          name:"Greater than Rs. 500",
          is_selected:false
        },
        {
          name:"Less than Rs. 200",
          is_selected:false
        },
      ]
    },
  ])

  const getCuisineData = async () => {
    try {
      const res = await axios.get(`${API_URL}/restraunt/cuisine/`);

      setCuisineData(res.data)
      setFilters(filters.map((item)=>{
        if(item.heading == 'Cuisines'){
          item.options = res.data
        }
        return item
      }))
    } catch (err) {}
  };

  useEffect(()=>{
    getCuisineData()
  },[])


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
          setIsLoading(false);
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

  const logoutCustomer = () => {
    setIsLoading(true);
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setIsLoading(false);
    setUser(null);
    setSelectedAddress({});
    setUserAddresses([]);
  };

  const loadCart = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const res = await axios.get(`${API_URL}/restraunt/cart/load/`, config);

      if (res.data.status == "success") {
        if (res.data.data == {}) {
          setCartRestrauntId(null);
        } else {
          setCartRestrauntId(res.data.data.restraunt);
        }
      }
    } catch (err) {}
  };

  const getUserAddressDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/address-details/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUserAddresses(res.data);

      const customerLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      res.data.map((data) => {
        const addressLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
        };

        var distance = getDistance(customerLocation, addressLocation);
        if (distance <= 200) {
          setSelectedAddress(data);
          setGlobalCoordinates({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      });
    } catch (err) {}
  };

  useEffect(() => {
    if (accessToken !== null) {
      loadCart();
    }
  }, [accessToken, orderPlaced]);

  useEffect(() => {
    if (accessToken !== null && location !== null && user !== null) {
      getUserAddressDetails();
    }
  }, [accessToken, location, user]);

  const deleteCart = async () => {
    try {
      await axios.delete(`${API_URL}/restraunt/cart/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {}
  };

  const addItemToCart = async (item_id, restrauntId) => {
    try {
      setDishToCart({ itemId: item_id, status: true });
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
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }
      setDishToCart({ itemId: item_id, status: false });
      return false;
    } catch (err) {
      setDishToCart({ itemId: item_id, status: false });
      return false;
    }
  };

  const removeItemToCart = async (item_id, restrauntId) => {
    setDishToCart({ itemId: item_id, status: true });
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
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }
      setDishToCart({ itemId: item_id, status: false });
      return false;
    } catch (err) {
      setDishToCart({ itemId: item_id, status: false });
      return false;
    }
  };

  const addCustomisedItemToCart = async (
    item_id,
    restrauntId,
    customisedOptions,
    isRepeated
  ) => {
    setDishToCart({ itemId: item_id, status: true });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axios.post(
        `${API_URL}/restraunt/cart/add-customised-item/`,
        {
          restrauntId: restrauntId,
          itemId: item_id,
          customisedOptions: customisedOptions,
          isRepeated: isRepeated,
        },
        config
      );

      if (res.data.message == "Customised Item Added to Cart") {
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }
      setDishToCart({ itemId: item_id, status: false });
      return false;
    } catch (err) {
      setDishToCart({ itemId: item_id, status: false });
      return false;
    }
  };

  const removeCustomisedItemToCart = async (item_id, restrauntId) => {
    setCustomisedIsNotRemoved(false);
    setDishToCart({ itemId: item_id, status: true });
    try {
      const res = await axios.post(
        `${API_URL}/restraunt/cart/remove-customised-item/`,
        {
          restrauntId: restrauntId,
          itemId: item_id,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.message == "Remove of multi item not possible") {
        setCustomisedIsNotRemoved(true);
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }

      if (res.data.message == "Item Removed to Cart") {
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }
      setDishToCart({ itemId: item_id, status: false });
      return false;
    } catch (err) {
      setDishToCart({ itemId: item_id, status: false });
      return false;
    }
  };

  const addCustomisedItemToCartFromCart = async (
    cartItemId,
    item_id,
    restrauntId,
    customisedOptions,
    isRepeated
  ) => {
    setDishToCart({ itemId: item_id, status: true });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axios.post(
        `${API_URL}/restraunt/cart/add-customised-item-cart/`,
        {
          restrauntId: restrauntId,
          cartItemId: cartItemId,
          customisedOptions: customisedOptions,
          isRepeated: isRepeated,
        },
        config
      );

      if (res.data.message == "Customised Item Added to Cart") {
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }
      setDishToCart({ itemId: item_id, status: false });
      return false;
    } catch (err) {
      setDishToCart({ itemId: item_id, status: false });
      return false;
    }
  };

  const removeCustomisedItemToCartFromCart = async (
    cartItemId,
    item_id,
    restrauntId
  ) => {
    setCustomisedIsNotRemoved(false);
    setDishToCart({ itemId: item_id, status: true });
    try {
      const res = await axios.post(
        `${API_URL}/restraunt/cart/remove-customised-item-cart/`,
        {
          cartItemId: cartItemId,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.message == "Remove of multi item not possible") {
        setCustomisedIsNotRemoved(true);
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }

      if (res.data.message == "Item Removed to Cart") {
        setDishToCart({ itemId: item_id, status: false });
        return true;
      }
      setDishToCart({ itemId: item_id, status: false });
      return false;
    } catch (err) {
      setDishToCart({ itemId: item_id, status: false });
      return false;
    }
  };

  const values = {
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,

    globalCoordinates,
    setGlobalCoordinates,
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

    addCustomisedItemToCart,
    removeCustomisedItemToCart,

    dishToCart,
    customisedIsNotRemoved,
    setCustomisedIsNotRemoved,
    addCustomisedItemToCartFromCart,
    removeCustomisedItemToCartFromCart,
    selectedAddress,
    setSelectedAddress,
    userAddresses,
    setUserAddresses,
    locationPermissionGranted,
    setLocationPermissionGranted,
    setOrderPlaced,
    orderPlaced,
    filters,
setFilters,
cuisineData
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const authContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
