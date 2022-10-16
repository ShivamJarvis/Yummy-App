import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";
import { API_URL } from "@env";
import { authContext } from "../../contexts/AuthContext";
import LoadingComponent from "../../components/LoadingComponent";
import OrderCard from "../../components/OrderComponents/OrderCard";

const MyOrdersScreen = ({navigation}) => {
  const [order, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = authContext();

  const getOrderDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/restraunt/order-detail/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <FeatherIcon
            name="chevron-left"
            size={35}
            style={{ color: "#f78783" }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      <FlatList
        data={order}
        renderItem={({ item, index }) => (
          <OrderCard item={item} key={item.id} />
        )}
      />
    </SafeAreaView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
});
