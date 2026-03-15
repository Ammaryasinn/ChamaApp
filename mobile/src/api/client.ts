import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// On web (browser preview) use localhost; on Android emulator use 10.0.2.2
const defaultBaseURL =
  Platform.OS === "web"
    ? "http://localhost:4000/api"
    : "http://10.0.2.2:4000/api";

export const apiClient = axios.create({
  baseURL: defaultBaseURL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("hazina.accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const customUrl = await AsyncStorage.getItem("hazina.backendUrl");
  if (customUrl) {
    config.baseURL = customUrl;
  }

  return config;
});
