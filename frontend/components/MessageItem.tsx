import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { MessageProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "./Avatar";
import Typo from "./Typo";
import { useAuth } from "@/context/authContext";

const MessageItem = ({
  item,
  isDirect,
}: {
  item: MessageProps;
  isDirect: boolean;
}) => {
  const { user: currentUser } = useAuth();
  const isMe = currentUser?.id === item.sender.id;

  const formattedDate = moment(item.createdAt).isSame(moment(), "day")
    ? moment(item.createdAt).format("h:mm:A")
    : moment(item.createdAt).format("MMM D, h:mm A");

  // console.log("message item: ", item);

  return (
    <View
      style={[
        styles.messageContainer,
        isMe ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {!isMe && !isDirect && (
        <Avatar
          size={30}
          uri={item?.sender?.avatar}
          style={styles.messageAvatar}
        />
      )}

      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        {!isMe && !isDirect && (
          <Typo color={colors.neutral900} fontWeight={"600"} size={13}>
            {item.sender.name}
          </Typo>
        )}

        {item.attachement && (
          <Image
            source={item.attachement}
            contentFit="cover"
            style={styles.attachment}
            transition={100}
          />
        )}

        {item.content && <Typo size={15}>{item.content}</Typo>}

        <Typo
          style={{ alignSelf: "flex-end" }}
          size={11}
          fontWeight={"500"}
          color={colors.neutral600}
        >
          {formattedDate}
        </Typo>
      </View>
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
