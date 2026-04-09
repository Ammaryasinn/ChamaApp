import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "http://192.168.100.3:4000/api"; // Default dev server URL

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple logout callback — set by AppNavigator
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (cb: () => void) => {
  onUnauthorized = cb;
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("hazina.accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem("hazina.accessToken");
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  requestOtp: (phoneNumber: string) =>
    api.post("/auth/request-otp", { phoneNumber }),
  verifyOtp: (phoneNumber: string, code: string) =>
    api.post("/auth/verify-otp", { phoneNumber, code }),
  updateProfile: (data: {
    profilePhotoUrl?: string;
    fullName?: string;
    nationalId?: string;
  }) => api.put("/auth/profile", data).then((r) => r.data),
};

export const notificationApi = {
  getMyNotifications: () => api.get("/notifications").then((r) => r.data),
};

export const chamaApi = {
  getMyChamas: () => api.get("/chamas").then((r) => r.data),
  getChamaDetails: (id: string) => api.get(`/chamas/${id}`).then((r) => r.data),
  updateSettings: (id: string, data: any) =>
    api.put(`/chamas/${id}`, data).then((r) => r.data),
  broadcastMessage: (id: string, message: string) =>
    api.post(`/chamas/${id}/broadcast`, { message }).then((r) => r.data),
  createChama: (data: any) => api.post("/chamas", data).then((r) => r.data),
};

export const uploadApi = {
  uploadImage: async (uri: string, folder: string = "hazina_users") => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: `upload-${Date.now()}.jpg`,
    } as any);

    formData.append("folder", folder);

    const { data } = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export const mpesaApi = {
  triggerStkPush: (data: any) =>
    api.post("/mpesa/stkpush", data).then((r) => r.data),
  checkStatus: (checkoutRequestId: string) =>
    api.get(`/mpesa/status/${checkoutRequestId}`).then((r) => r.data),
};

export const mgrApi = {
  getSchedule: (chamaId: string) =>
    api.get(`/chamas/${chamaId}/mgr/schedule`).then((r) => r.data),
};

export const loanApi = {
  getLoans: (chamaId: string) =>
    api.get(`/chamas/${chamaId}/loans`).then((r) => r.data),
  requestLoan: (
    chamaId: string,
    amount: number,
    repaymentMonths: number,
    purpose: string,
  ) =>
    api
      .post(`/chamas/${chamaId}/loans`, { amount, repaymentMonths, purpose })
      .then((r) => r.data),
  voteLoan: (chamaId: string, loanId: string, vote: "yes" | "no" | "abstain") =>
    api
      .post(`/chamas/${chamaId}/loans/${loanId}/vote`, { vote })
      .then((r) => r.data),
};
