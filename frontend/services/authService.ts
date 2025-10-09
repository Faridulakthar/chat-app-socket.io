import { API_URL } from "@/constants";
import axios from "axios";

export const login = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    return response?.data;
  } catch (error: any) {
    console.log("got error", error);
    const msg = error?.response?.data?.msg || "Login failed";
    throw new Error(msg);
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  avatar?: string | null
): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      avatar,
    });

    return response?.data;
  } catch (error: any) {
    console.log("got error", error);
    const msg = error?.response?.data?.msg || "Register failed";
    throw new Error(msg);
  }
};
