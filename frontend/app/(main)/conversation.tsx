import Avatar from "@/components/Avatar";
import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Icons from "phosphor-react-native";
import MessageItem from "@/components/MessageItem";
import Input from "@/components/Input";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import Loader from "@/components/Loader";
import { uploadFileToCloudinary } from "@/services/imageService";

const Conversation = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const data = useLocalSearchParams();

  const {
    id: conversationId,
    name,
    type,
    avatar,
    participants: stringifiedPariticipants,
  } = data;

  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

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

  const dummyMessages = [
    {
      id: "msg_10",
      sender: {
        id: "user_1",
        name: "Jane Smith",
        avatar: null,
      },
      content: "Hello! How are you?",
      createdAt: "2024-10-01T10:05:00Z",
      isMe: true,
    },
    {
      id: "msg_11",
      sender: {
        id: "user_2",
        name: "Jane Smith",
        avatar: null,
      },
      content: "Yeah, I'm doing good too. Thanks for asking!",
      createdAt: "2024-10-01T10:05:00Z",
      isMe: false,
    },
    {
      id: "msg_12",
      sender: {
        id: "user_1",
        name: "Jane Smith",
        avatar: null,
      },
      content: "What's up? Long time no see.",
      createdAt: "2024-10-01T10:05:00Z",
      isMe: true,
    },
    {
      id: "msg_13",
      sender: {
        id: "user_2",
        name: "Jane Smith",
        avatar: null,
      },
      content: "Hey",
      createdAt: "2024-10-01T10:05:00Z",
      isMe: false,
    },
  ];

  const onPickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const onSend = async () => {
    if (!message?.trim() && !selectedFile) return;

    if (!currentUser) return;

    setLoading(true);

    try {
      let attachment = null;

      if (selectedFile) {
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          "mesage-attachments"
        );

        if (uploadResult?.success) {
          attachment = uploadResult.data;
          console.log({ attachment });
        } else {
          Alert.alert(
            "Image Upload",
            uploadResult?.msg || "Failed to upload image"
          );
          setLoading(false);
          return;
        }
      }
    } catch (error: any) {
      console.log("Error sending message", error);
      Alert.alert("Message", error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <Header
          style={styles.header}
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton />
              <Avatar
                uri={conversationAvatar as string}
                size={40}
                isGroup={type === "group"}
              />
              <Typo color={colors.white} size={22} fontWeight={"500"}>
                {conversationName}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity style={{ marginVertical: verticalScale(7) }}>
              <Icons.DotsThreeOutlineVerticalIcon
                weight="fill"
                color={colors.white}
              />
            </TouchableOpacity>
          }
        />

        {/* Message */}
        <View style={styles.content}>
          <FlatList
            data={dummyMessages}
            inverted={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.footer}>
            <Input
              value={message}
              onChangeText={setMessage}
              containerStyle={{
                paddingLeft: spacingX._10,
                paddingRight: scale(65),
                borderWidth: 0,
              }}
              placeholder="Type Message"
              icon={
                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                  <Icons.PlusIcon
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(22)}
                  />

                  {selectedFile && selectedFile?.uri && (
                    <Image
                      source={selectedFile?.uri}
                      style={styles.selectedFile}
                    />
                  )}
                </TouchableOpacity>
              }
            />

            <View style={styles.InputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                {loading ? (
                  <Loader size="small" />
                ) : (
                  <Icons.PaperPlaneTiltIcon
                    color={colors.black}
                    weight="bold"
                    size={verticalScale(22)}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
