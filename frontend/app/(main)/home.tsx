import { StyleSheet,  } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import { colors } from "@/constants/theme";
import { testSocket } from "@/socket/socketEvents";

const Home = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    testSocket(testSocketCallbackHandler);
    testSocket(null)

    return () => {
      testSocket(testSocketCallbackHandler, true)
    }
  }, []);

  const testSocketCallbackHandler = (data: any) => {
    console.log("Got response from test socket", data);
  };

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
