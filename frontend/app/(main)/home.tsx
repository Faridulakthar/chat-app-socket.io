import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import { colors } from "@/constants/theme";

const Home = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenWrapper>
      <Typo color={colors.white}>Home</Typo>

      <Button onPress={handleLogout} style={{ marginTop: 20 }}>
        <Typo>Log out</Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
