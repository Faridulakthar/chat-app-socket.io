import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";

const Register = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const onSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Sign Up", "Please fill all the  fields");
      return;
    }

    try {
      setIsLoading(true);
      await signUp(nameRef.current, emailRef.current, passwordRef.current, "");
    } catch (error: any) {
      Alert.alert("Registration failed", error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton iconSize={28} />
            <Typo size={17} color={colors.white}>
              Need some help?
            </Typo>
          </View>

          <View style={styles.content}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.form}
            >
              <View style={{ gap: spacingY._10, marginBottom: spacingY._15 }}>
                <Typo size={28} fontWeight={"600"}>
                  Getting Started
                </Typo>
                <Typo color={colors.neutral600}>
                  Create an account to continue
                </Typo>
              </View>

              <Input
                placeholder="Enter your name"
                onChangeText={(value: string) => {
                  nameRef.current = value;
                }}
                icon={
                  <Icons.UserIcon
                    color={colors.neutral600}
                    size={verticalScale(26)}
                  />
                }
              />

              <Input
                placeholder="Enter your email"
                onChangeText={(value: string) => {
                  emailRef.current = value;
                }}
                icon={
                  <Icons.AtIcon
                    color={colors.neutral600}
                    size={verticalScale(26)}
                  />
                }
                autoCapitalize="none"
              />

              <Input
                secureTextEntry={true}
                placeholder="Enter your password"
                onChangeText={(value: string) => {
                  passwordRef.current = value;
                }}
                icon={
                  <Icons.LockIcon
                    color={colors.neutral600}
                    size={verticalScale(26)}
                  />
                }
              />

              <View style={{ marginTop: spacingY._25, gap: spacingY._15 }}>
                <Button loading={isLoading} onPress={onSubmit}>
                  <Typo fontWeight="bold" color={colors.black} size={20}>
                    Sign Up
                  </Typo>
                </Button>

                <View style={styles.footer}>
                  <Typo>Already have an account?</Typo>
                  <Pressable onPress={() => router.push("/(auth)/login")}>
                    <Typo color={colors.primaryDark} fontWeight={"bold"}>
                      Login
                    </Typo>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },
  form: {
    gap: spacingY._15,
    marginTop: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
