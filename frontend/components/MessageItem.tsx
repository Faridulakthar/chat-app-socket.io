import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";

const MessageItem = () => {
  return (
    <View>
      <Text>MessageItem</Text>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  theirBubble: {
    backgroundColor: colors.otherBubble,
  },
  myBubble: {
    backgroundColor: colors.myBubble,
  },
  messageBubble: {
    padding: spacingX._10,
    borderRadius: radius._15,
    gap: spacingY._5,
  },
  attachment: {
    height: verticalScale(180),
    width: verticalScale(180),
    borderRadius: radius._10,
  },
  messageAvatar: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  messageContainer: {
    flexDirection: "row",
    gap: spacingX._7,
    maxWidth: "80%",
  },
});
