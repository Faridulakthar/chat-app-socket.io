import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

const BackButton = ({
  style,
  iconSize = 26,
  color = colors.white,
}: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
    >
      <CaretLeftIcon
        weight="bold"
        size={verticalScale(iconSize)}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {},
});
