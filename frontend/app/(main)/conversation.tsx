import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const Conversation = () => {
  const { user: currentUser } = useAuth();
  const data = useLocalSearchParams();

  const {
    id: conversationId,
    name,
    type,
    avatar,
    participants: stringifiedPariticipants,
  } = data;

  const participants = JSON.parse(stringifiedPariticipants as string);

  let conversationAvatar = avatar;
  let isDirect = type === "direct";

  const otherParticipant = isDirect
    ? participants?.find((p: any) => p._id !== currentUser?.id)
    : null;

  if (isDirect && otherParticipant) {
    conversationAvatar = otherParticipant?.avatar;
  }

  let conversationName = isDirect ? otherParticipant?.name : (name as string);

  return (
    <ScreenWrapper>
      <Typo color={colors.white}>Conversation</Typo>
    </ScreenWrapper>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  messagesContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  messagesContainer: {
    flex: 1,
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: verticalScale(22),
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._15,
  },
  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
  InputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  container: {
    flex: 1,
  },
});
