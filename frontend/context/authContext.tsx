import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { login, register } from "@/services/authService";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);

  const router = useRouter();

  const updateToken = async (token: string) => {
    if (token) {
      setToken(token);
      await AsyncStorage.setItem("token", token);
      //   decode token
      const decoded = jwtDecode<DecodedTokenProps>(token);
      console.log("decoded token: ", decoded);
      setUser(decoded?.user);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);

    await updateToken(response?.token);
    router.replace("/(main)/home");
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    avatar?: string | null
  ) => {
    const response = await register(name, email, password, avatar);

    await updateToken(response?.token);
    router.replace("/(main)/home");
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    ></AuthContext.Provider>
  );
};

export const useAuth = useContext(AuthContext);
