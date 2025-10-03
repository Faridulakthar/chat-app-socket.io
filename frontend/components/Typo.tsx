import { Text, TextStyle } from "react-native";
import React from "react";
import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";

const Typo = ({
  size = 16,
  color,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: verticalScale(size),
    color,
    fontWeight,
  };

  return <Text style={[textStyle, { ...textProps }]}>{children}</Text>;
};

export default Typo;
