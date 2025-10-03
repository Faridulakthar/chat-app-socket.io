import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

const Loader = ({
  size = "large",
  color = colors.primary,
}: ActivityIndicatorProps) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loader;
