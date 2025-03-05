import axios from "axios";
import { RegisterData, LoginData, User } from "../types";

const API_URL = "http://localhost:3001/api/users";

export const registerUser = async (userData: RegisterData): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (email: string, password: string, loginData: LoginData): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
