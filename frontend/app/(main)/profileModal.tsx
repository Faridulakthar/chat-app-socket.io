import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Avatar from "@/components/Avatar";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { useAuth } from "@/context/authContext";
import { UserProps } from "@/types";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { updateProfile } from "@/socket/socketEvents";

const ProfileModal = () => {
  const router = useRouter();
  const { user, signOut, updateToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserProps>({
    email: "",
    name: "",
    avatar: null,
  });

  useEffect(() => {
    updateProfile(processUpdateProfile);

    return () => {
      updateProfile(processUpdateProfile, true);
    };
  }, []);

  const processUpdateProfile = (res: any) => {
    setLoading(false);

    if (res.success) {
      updateToken(res?.data?.token);
      router.back();
    } else {
      Alert.alert("Update Profile", res.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    if (user) {
      setUserData({
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
    }
  }, [user]);

  const onSubmit = () => {
    const { name, avatar } = userData;

    if (!name) {
      Alert.alert("User", "Please enter your name");
      return;
    }

    let data = {
      name,
      avatar,
    };

    setLoading(true);
    updateProfile(data);
  };

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {},
      },
      {
        text: "Log Out",
        onPress: async () => {
          router.back();
          await signOut();
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={
            Platform.OS === "android" && <BackButton color={colors.black} />
          }
          style={{ marginVertical: spacingY._15 }}
        />

        {/* Form */}

        <ScrollView contentContainerStyle={styles.from}>
          <View style={styles.avatarContainer}>
            <Avatar uri={null} size={170} />
            <TouchableOpacity style={styles.editIcon}>
              <Icons.PencilIcon
                size={verticalScale(20)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: spacingY._20 }}>
            <View style={styles.inputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Email</Typo>

              <Input
                value={userData?.email || ""}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                  backgroundColor: colors.neutral300,
                }}
                editable={false}
                onChangeText={(value) =>
                  setUserData({ ...userData, email: value })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Typo style={{ paddingLeft: spacingX._10 }}>Name</Typo>

              <Input
                value={userData?.name || ""}
                containerStyle={{
                  borderColor: colors.neutral350,
                  paddingLeft: spacingX._20,
                }}
                onChangeText={(value) =>
                  setUserData({ ...userData, name: value })
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {!loading && (
          <Button
            onPress={showLogoutAlert}
            style={{
              backgroundColor: colors.rose,
              height: verticalScale(56),
              width: verticalScale(56),
            }}
          >
            <Icons.SignOutIcon
              size={verticalScale(30)}
              color={colors.white}
              weight="bold"
            />
          </Button>
        )}
        <Button loading={loading} onPress={onSubmit} style={{ flex: 1 }}>
          <Typo fontWeight="bold" color={colors.white} size={18}>
            Update
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._7,
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  from: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral200,
    marginBottom: spacingY._10,
    borderTopWidth: 2,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
});
