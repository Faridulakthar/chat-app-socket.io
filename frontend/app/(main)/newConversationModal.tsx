import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";

const NewConversationModal = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupConversation = isGroup === "1";
  const router = useRouter();

  const contacts = [
    {
      id: "1",
      name: "Jaime Lannister",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: "2",
      name: "Sansa Stark",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: "3",
      name: "Yara Greyjoy",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
  ];

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={isGroupConversation ? "New Group" : "Select User"}
          leftIcon={<BackButton color={colors.black} />}
          rightIcon={<></>}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewConversationModal;

const styles = StyleSheet.create({
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  checkbox: {
    width: 24,
    height: 25,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  sectionIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  contactList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: verticalScale(150),
  },
  selectedContact: {
    backgroundColor: colors.neutral200,
    borderRadius: radius._10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  groupNameContainer: {
    width: "100%",
  },
  avatarContainer: {
    marginBottom: spacingY._10,
  },
  groupInfoContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
});
