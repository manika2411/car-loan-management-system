import api from "../api";

export const getMyPayments = async () => {
  const response = await api.get("/api/payments/my");
  return response.data;
};

export const getAllPayments = async () => {
  const response = await api.get("/api/payments");
  return response.data;
};

export const makePayment = async (emiId,paymentData) => {
  const response = await api.post(`/api/payments/pay/${emiId}`,paymentData);
  return response.data;
};