import api from "../api";

export const login = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

export const register = async (user) => {
  const response = await api.post("/api/auth/register", user);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/users/me");
  return response.data;
};

export const sendOtp = async (email) => {
  const response = await api.post("/api/otp/send", { email });
  return response.data;
};

export const verifyOtp = async (email, code) => {
  const response = await api.post("/api/otp/verify", { email, code });
  return response.data;
};
