import { NavigationContainer } from "@react-navigation/native";
import LoginNavigation from "./LoginNavigation";
import { authContext } from "./../contexts/AuthContext";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import LoadingComponent from "../components/LoadingComponent";
import Toast from "react-native-simple-toast";
import RequestLocationPermission from "../Screens/HelperScreens/RequestLocationPermission";
import ProtectedRouteNavigation from "./ProtectedRouteNavigation";


export default function AppNav() {
  const {
    isAuthenticated,
    setLocation,
    loginCustomer,
    setGlobalCoordinates,
    locationPermissionGranted,
    setLocationPermissionGranted,
  } = authContext();

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
       
          Toast.show("Permission to access location was denied", Toast.LONG);
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocationPermissionGranted(true);
        setLocation(location);

        setGlobalCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setLoading(false);

        loginCustomer();
      } catch (err) {}
    })();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!locationPermissionGranted) {
    return <RequestLocationPermission />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
          <ProtectedRouteNavigation />
      ) : (
        <LoginNavigation />
      )}
    </NavigationContainer>
  );
}
