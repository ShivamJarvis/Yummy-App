import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

const RadioButton = ({ data }) => {
  return (
    <View>
      {data.map((item) => {
        return (
          <Pressable key={item.label}>
            <Text> {item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({});
